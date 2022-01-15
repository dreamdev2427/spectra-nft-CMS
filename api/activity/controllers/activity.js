'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async create_files(ctx) {
        let params = ctx.request.body;
        let data = { ...params };
        try {
            for(let i = 0; i < params.nfts.length; i ++) {
                data.nft = params.nfts[i];
                await strapi.services.activity.create(data);
            }
            ctx.send({ success: true });
        } catch (error) {
            ctx.badRequest(null, error);
        }
    },

    async fetch_monthly(ctx) {
        let param = ctx.query.type;
        let this_year, last_year;
        if (param === 'act') {
            this_year = await strapi.connections.default.raw(
                `SELECT Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dev FROM 
                (( SELECT count(id) as Jan FROM activities where strftime('%m', date(created_at/1000, 'unixepoch')) = '01' and strftime('%Y', date(created_at/1000, 'unixepoch')) = strftime('%Y', 'now')),
                ( SELECT count(id) as Feb FROM activities where strftime('%m', date(created_at/1000, 'unixepoch')) = '02' and strftime('%Y', date(created_at/1000, 'unixepoch')) = strftime('%Y', 'now')),
                ( SELECT count(id) as Mar FROM activities where strftime('%m', date(created_at/1000, 'unixepoch')) = '03' and strftime('%Y', date(created_at/1000, 'unixepoch')) = strftime('%Y', 'now')),
                ( SELECT count(id) as Apr FROM activities where strftime('%m', date(created_at/1000, 'unixepoch')) = '04' and strftime('%Y', date(created_at/1000, 'unixepoch')) = strftime('%Y', 'now')),
                ( SELECT count(id) as May FROM activities where strftime('%m', date(created_at/1000, 'unixepoch')) = '05' and strftime('%Y', date(created_at/1000, 'unixepoch')) = strftime('%Y', 'now')),
                ( SELECT count(id) as Jun FROM activities where strftime('%m', date(created_at/1000, 'unixepoch')) = '06' and strftime('%Y', date(created_at/1000, 'unixepoch')) = strftime('%Y', 'now')),
                ( SELECT count(id) as Jul FROM activities where strftime('%m', date(created_at/1000, 'unixepoch')) = '07' and strftime('%Y', date(created_at/1000, 'unixepoch')) = strftime('%Y', 'now')),
                ( SELECT count(id) as Aug FROM activities where strftime('%m', date(created_at/1000, 'unixepoch')) = '08' and strftime('%Y', date(created_at/1000, 'unixepoch')) = strftime('%Y', 'now')),
                ( SELECT count(id) as Sep FROM activities where strftime('%m', date(created_at/1000, 'unixepoch')) = '09' and strftime('%Y', date(created_at/1000, 'unixepoch')) = strftime('%Y', 'now')),
                ( SELECT count(id) as Oct FROM activities where strftime('%m', date(created_at/1000, 'unixepoch')) = '10' and strftime('%Y', date(created_at/1000, 'unixepoch')) = strftime('%Y', 'now')),
                ( SELECT count(id) as Nov FROM activities where strftime('%m', date(created_at/1000, 'unixepoch')) = '11' and strftime('%Y', date(created_at/1000, 'unixepoch')) = strftime('%Y', 'now')),
                ( SELECT count(id) as Dev FROM activities where strftime('%m', date(created_at/1000, 'unixepoch')) = '12' and strftime('%Y', date(created_at/1000, 'unixepoch')) = strftime('%Y', 'now')));`
            );
    
            last_year = await strapi.connections.default.raw(
                `SELECT Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dev FROM 
                (( SELECT count(id) as Jan FROM activities where strftime('%m', date(created_at/1000, 'unixepoch')) = '01' and strftime('%Y', date(created_at/1000, 'unixepoch')) = strftime('%Y', 'now', '-1 years')),
                ( SELECT count(id) as Feb FROM activities where strftime('%m', date(created_at/1000, 'unixepoch')) = '02' and strftime('%Y', date(created_at/1000, 'unixepoch')) = strftime('%Y', 'now', '-1 years')),
                ( SELECT count(id) as Mar FROM activities where strftime('%m', date(created_at/1000, 'unixepoch')) = '03' and strftime('%Y', date(created_at/1000, 'unixepoch')) = strftime('%Y', 'now', '-1 years')),
                ( SELECT count(id) as Apr FROM activities where strftime('%m', date(created_at/1000, 'unixepoch')) = '04' and strftime('%Y', date(created_at/1000, 'unixepoch')) = strftime('%Y', 'now', '-1 years')),
                ( SELECT count(id) as May FROM activities where strftime('%m', date(created_at/1000, 'unixepoch')) = '05' and strftime('%Y', date(created_at/1000, 'unixepoch')) = strftime('%Y', 'now', '-1 years')),
                ( SELECT count(id) as Jun FROM activities where strftime('%m', date(created_at/1000, 'unixepoch')) = '06' and strftime('%Y', date(created_at/1000, 'unixepoch')) = strftime('%Y', 'now', '-1 years')),
                ( SELECT count(id) as Jul FROM activities where strftime('%m', date(created_at/1000, 'unixepoch')) = '07' and strftime('%Y', date(created_at/1000, 'unixepoch')) = strftime('%Y', 'now', '-1 years')),
                ( SELECT count(id) as Aug FROM activities where strftime('%m', date(created_at/1000, 'unixepoch')) = '08' and strftime('%Y', date(created_at/1000, 'unixepoch')) = strftime('%Y', 'now', '-1 years')),
                ( SELECT count(id) as Sep FROM activities where strftime('%m', date(created_at/1000, 'unixepoch')) = '09' and strftime('%Y', date(created_at/1000, 'unixepoch')) = strftime('%Y', 'now', '-1 years')),
                ( SELECT count(id) as Oct FROM activities where strftime('%m', date(created_at/1000, 'unixepoch')) = '10' and strftime('%Y', date(created_at/1000, 'unixepoch')) = strftime('%Y', 'now', '-1 years')),
                ( SELECT count(id) as Nov FROM activities where strftime('%m', date(created_at/1000, 'unixepoch')) = '11' and strftime('%Y', date(created_at/1000, 'unixepoch')) = strftime('%Y', 'now', '-1 years')),
                ( SELECT count(id) as Dev FROM activities where strftime('%m', date(created_at/1000, 'unixepoch')) = '12' and strftime('%Y', date(created_at/1000, 'unixepoch')) = strftime('%Y', 'now', '-1 years')));`
            );
        } else if (param === 'BNB' || param === 'SPC') {
            this_year = await strapi.connections.default.raw(
                `SELECT Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dev FROM 
                (( SELECT ifnull(sum(price), 0) as Jan FROM activities where strftime('%m', date(created_at/1000, 'unixepoch')) = '01' and strftime('%Y', date(created_at/1000, 'unixepoch')) = strftime('%Y', 'now') and token_type='${param}'),
                ( SELECT ifnull(sum(price), 0) as Feb FROM activities where strftime('%m', date(created_at/1000, 'unixepoch')) = '02' and strftime('%Y', date(created_at/1000, 'unixepoch')) = strftime('%Y', 'now') and token_type='${param}'),
                ( SELECT ifnull(sum(price), 0) as Mar FROM activities where strftime('%m', date(created_at/1000, 'unixepoch')) = '03' and strftime('%Y', date(created_at/1000, 'unixepoch')) = strftime('%Y', 'now') and token_type='${param}'),
                ( SELECT ifnull(sum(price), 0) as Apr FROM activities where strftime('%m', date(created_at/1000, 'unixepoch')) = '04' and strftime('%Y', date(created_at/1000, 'unixepoch')) = strftime('%Y', 'now') and token_type='${param}'),
                ( SELECT ifnull(sum(price), 0) as May FROM activities where strftime('%m', date(created_at/1000, 'unixepoch')) = '05' and strftime('%Y', date(created_at/1000, 'unixepoch')) = strftime('%Y', 'now') and token_type='${param}'),
                ( SELECT ifnull(sum(price), 0) as Jun FROM activities where strftime('%m', date(created_at/1000, 'unixepoch')) = '06' and strftime('%Y', date(created_at/1000, 'unixepoch')) = strftime('%Y', 'now') and token_type='${param}'),
                ( SELECT ifnull(sum(price), 0) as Jul FROM activities where strftime('%m', date(created_at/1000, 'unixepoch')) = '07' and strftime('%Y', date(created_at/1000, 'unixepoch')) = strftime('%Y', 'now') and token_type='${param}'),
                ( SELECT ifnull(sum(price), 0) as Aug FROM activities where strftime('%m', date(created_at/1000, 'unixepoch')) = '08' and strftime('%Y', date(created_at/1000, 'unixepoch')) = strftime('%Y', 'now') and token_type='${param}'),
                ( SELECT ifnull(sum(price), 0) as Sep FROM activities where strftime('%m', date(created_at/1000, 'unixepoch')) = '09' and strftime('%Y', date(created_at/1000, 'unixepoch')) = strftime('%Y', 'now') and token_type='${param}'),
                ( SELECT ifnull(sum(price), 0) as Oct FROM activities where strftime('%m', date(created_at/1000, 'unixepoch')) = '10' and strftime('%Y', date(created_at/1000, 'unixepoch')) = strftime('%Y', 'now') and token_type='${param}'),
                ( SELECT ifnull(sum(price), 0) as Nov FROM activities where strftime('%m', date(created_at/1000, 'unixepoch')) = '11' and strftime('%Y', date(created_at/1000, 'unixepoch')) = strftime('%Y', 'now') and token_type='${param}'),
                ( SELECT ifnull(sum(price), 0) as Dev FROM activities where strftime('%m', date(created_at/1000, 'unixepoch')) = '12' and strftime('%Y', date(created_at/1000, 'unixepoch')) = strftime('%Y', 'now') and token_type='${param}'));`
            );
    
            last_year = await strapi.connections.default.raw(
                `SELECT Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dev FROM 
                (( SELECT ifnull(sum(price), 0) as Jan FROM activities where strftime('%m', date(created_at/1000, 'unixepoch')) = '01' and strftime('%Y', date(created_at/1000, 'unixepoch')) = strftime('%Y', 'now', '-1 years') and token_type='${param}'),
                ( SELECT ifnull(sum(price), 0) as Feb FROM activities where strftime('%m', date(created_at/1000, 'unixepoch')) = '02' and strftime('%Y', date(created_at/1000, 'unixepoch')) = strftime('%Y', 'now', '-1 years') and token_type='${param}'),
                ( SELECT ifnull(sum(price), 0) as Mar FROM activities where strftime('%m', date(created_at/1000, 'unixepoch')) = '03' and strftime('%Y', date(created_at/1000, 'unixepoch')) = strftime('%Y', 'now', '-1 years') and token_type='${param}'),
                ( SELECT ifnull(sum(price), 0) as Apr FROM activities where strftime('%m', date(created_at/1000, 'unixepoch')) = '04' and strftime('%Y', date(created_at/1000, 'unixepoch')) = strftime('%Y', 'now', '-1 years') and token_type='${param}'),
                ( SELECT ifnull(sum(price), 0) as May FROM activities where strftime('%m', date(created_at/1000, 'unixepoch')) = '05' and strftime('%Y', date(created_at/1000, 'unixepoch')) = strftime('%Y', 'now', '-1 years') and token_type='${param}'),
                ( SELECT ifnull(sum(price), 0) as Jun FROM activities where strftime('%m', date(created_at/1000, 'unixepoch')) = '06' and strftime('%Y', date(created_at/1000, 'unixepoch')) = strftime('%Y', 'now', '-1 years') and token_type='${param}'),
                ( SELECT ifnull(sum(price), 0) as Jul FROM activities where strftime('%m', date(created_at/1000, 'unixepoch')) = '07' and strftime('%Y', date(created_at/1000, 'unixepoch')) = strftime('%Y', 'now', '-1 years') and token_type='${param}'),
                ( SELECT ifnull(sum(price), 0) as Aug FROM activities where strftime('%m', date(created_at/1000, 'unixepoch')) = '08' and strftime('%Y', date(created_at/1000, 'unixepoch')) = strftime('%Y', 'now', '-1 years') and token_type='${param}'),
                ( SELECT ifnull(sum(price), 0) as Sep FROM activities where strftime('%m', date(created_at/1000, 'unixepoch')) = '09' and strftime('%Y', date(created_at/1000, 'unixepoch')) = strftime('%Y', 'now', '-1 years') and token_type='${param}'),
                ( SELECT ifnull(sum(price), 0) as Oct FROM activities where strftime('%m', date(created_at/1000, 'unixepoch')) = '10' and strftime('%Y', date(created_at/1000, 'unixepoch')) = strftime('%Y', 'now', '-1 years') and token_type='${param}'),
                ( SELECT ifnull(sum(price), 0) as Nov FROM activities where strftime('%m', date(created_at/1000, 'unixepoch')) = '11' and strftime('%Y', date(created_at/1000, 'unixepoch')) = strftime('%Y', 'now', '-1 years') and token_type='${param}'),
                ( SELECT ifnull(sum(price), 0) as Dev FROM activities where strftime('%m', date(created_at/1000, 'unixepoch')) = '12' and strftime('%Y', date(created_at/1000, 'unixepoch')) = strftime('%Y', 'now', '-1 years') and token_type='${param}'));`
            );
        }

        const this_month = await strapi.connections.default.raw(
            `SELECT strftime('%m', 'now') as Month`
        );

        const data = {this_year, last_year, this_month};
        return data;
    },
    
    async fetch_balance(ctx) {
        let param = ctx.query.type;

        const data = await strapi.connections.default.raw(
            `SELECT ifnull(sum(price), 0) as price from activities where token_type = '${param}'`
        );
        return data[0];
    },
};
