'use strict';
const { sanitizeEntity } = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async find(ctx) {
        const entity = await strapi.services.nft.find(ctx.query, [
            'author', 'author.id', 'author.avatar', 'author.nfts', 'bids', 'preview_image', 'bids.author', 'bids.author.avatar', 'end_date', 
            'creator', 'creator.id', 'creator.avatar'
        ]);

        let sanitized = sanitizeEntity(entity, { model: strapi.models.nft });
        for (let i = 0; i < sanitized.length; i ++) {
            const sortedBids = sanitized[i].bids.sort((a, b) => (a.value < b.value) ? 1 : -1);
            sanitized[i].bids = sortedBids;
            sanitized[i].history = sortedBids;

            if (sanitized[i].status === 'on_auction' && sanitized[i].end_date) {
                sanitized[i].deadline = sanitized[i].end_date + Date.parse(sanitized[i].updated_at) - Date.now();
            }
            if (sanitized[i].deadline < 0 || isNaN(sanitized[i].deadline))
                sanitized[i].deadline = 0;
        }
        return sanitized;
    },

    async findOne(ctx) {
        const { id } = ctx.params;

        const entity = await strapi.services.nft.findOne({ id }, [
            'author', 'author.id', 'author.avatar', 'author.nfts', 'bids', 'preview_image', 'bids.author', 'bids.author.avatar',
            'creator', 'creator.id', 'creator.avatar'
        ]);

        let sanitized = sanitizeEntity(entity, { model: strapi.models.nft });
        const sortedBids = sanitized.bids.sort((a, b) => (a.value < b.value) ? 1 : -1);
        sanitized.bids = sortedBids;
        sanitized.history = sortedBids;
        sanitized.deadline = sanitized.end_date ? sanitized.end_date + Date.parse(sanitized.updated_at) - Date.now() : 0;
        if (sanitized.deadline < 0) sanitized.deadline = 0;
        return sanitized;
    },

    async search(ctx) {
        const params = ctx.request.body.data;
        try {
            let duplicate = [];
            for(let i = 0; i < params.length; i ++) {
                const entries = await strapi.services.nft.findOne({unique_id: params[i]});
                if (entries) {
                    duplicate.push(entries.title);
                }
            }
            if (duplicate.length > 0)
                ctx.send({ success: true, data: duplicate });
            else
                ctx.send({ success: false });
            return duplicate;
        } catch (error) {
            ctx.badRequest(null, error);
        }
    },

    async showcase(ctx) {
        const entity = await strapi.services.nft.find(ctx.query, [
            'author', 'preview_image'
        ]);

        const sanitized = sanitizeEntity(entity, { model: strapi.models.nft });
        const filtered = sanitized.filter(item => item.showcase);

        return filtered;
    },

    async create_files(ctx) {
        let params = ctx.request.body;
        let data = { ...params };
        try {
            for(let i = 0; i < params.unique_ids.length; i ++) {
                data.preview_image = params.image_data[i];
                data.unique_id = params.unique_ids[i];
                data.token_uri = params.token_uris[i];
                data.title =  params.title + " #" + `${i+1}`.padStart(3, 0);
                await strapi.services.nft.create(data);
            }
            ctx.send({ success: true });
        } catch (error) {
            ctx.badRequest(null, error);
        }
    },

    async getRemainDeadline(ctx) {      
        const { id } = ctx.params;

        const entity = await strapi.services.nft.findOne({ id });
        const sanitized = sanitizeEntity(entity, { model: strapi.models.nft });
        const sortedBids = sanitized.bids.sort((a, b) => (a.id < b.id) ? 1 : -1);
        sanitized.bids = sortedBids;
        sanitized.history = sortedBids;

        let end_date = sanitized.end_date ? sanitized.end_date + Date.parse(sanitized.updated_at) - Date.now() : 0;
        if (end_date < 0) end_date = 0;
        return end_date;
    }
};
