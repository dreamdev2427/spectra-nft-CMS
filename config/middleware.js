module.exports = {
    load: {
        before: ['responseTime', 'cors', 'responses', 'auctionTimer'],
        order: ['responseTime', 'cors', 'responses', 'auctionTimer'],
        after: ['parser', 'router'],
    },
    settings: {
        cors: {
            enabled: true,
            origin: ['*'],
            // headers: ['*']
        },
        auctionTimer: {
            enabled: true,
        },
    },
};