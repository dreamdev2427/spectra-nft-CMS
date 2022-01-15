'use strict';
const { sanitizeEntity } = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async find(ctx) {
        const entity = await strapi.services.author.find(ctx.query, 
            ["nfts", "bids", "author_sale", 'avatar', 'avatar.url', 'banner', 'banner.url', 'wallet' ]);

        const sanitized = sanitizeEntity(entity, { model: strapi.models.author });
        const sorted = sanitized.sort((a, b) => {
            if (!a.author_sale || !b.author_sale)
                return -1;
            if (a.author_sale.sales === null || !b.author_sale.sales === null)
                return -1;
            return (a.author_sale.sales < b.author_sale.sales) ? 1 : -1
        });

        return sorted;
    },

    async findOne(ctx) {
        const { id } = ctx.params;
        const entity = await strapi.services.author.findOne({id}, 
            ["nfts", "bids", "author_sale", 'avatar', 'avatar.url', 'banner', 'banner.url', 'wallet' ]);
        let data = {};
        if (entity) {
            data = sanitizeEntity(entity, { model: strapi.models.author });
        }
        return data;
    },
    
    async ranks(ctx) {
        const entity = await strapi.services.author.find(ctx.query, [
            'author_sale', 'avatar'
        ]);

        const sanitized = sanitizeEntity(entity, { model: strapi.models.author });
        const sorted = sanitized.sort((a, b) => (a.author_sale.volume < b.author_sale.volume) ? 1 : -1);

        return sorted;
    }
};
