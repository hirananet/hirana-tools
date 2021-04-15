export const environments = {
    bot: {
        enabled: true,
        channels: process.env.CHANNELS ? process.env.CHANNELS.split(',') : [
            "#main",
            "#underc0de"
        ],
        server: "irc.hirana.net",
        botName: process.env.BOTNAME ? process.env.BOTNAME : "HiranaBot",
        password: process.env.PASSWORD ? process.env.PASSWORD : '',
        owners: process.env.OWNERS ? process.env.OWNERS.split(',') : [
            "alex",
            "gabriela-"
        ]
    },
    avatarStorageKey: 'avatar-custom',
    storageLocation: './dataStored',
    resourcesLocation: './resources',
    avatarHttpTimeout: 3000,
    urlCacheKey: 'url-processor',
    urlHttpTimeout: 1500,
    urlMaxBodyLength: 35000,
    rcStorageKey: 'rangos-custom',
    gcStorageKey: 'global-custom',
    imgurApiClientID: process.env.IMGUR_CLIENT_ID ? process.env.IMGUR_CLIENT_ID : '',
    imgurApiURL: 'https://api.imgur.com/3/upload',
    imgurHttpTimeout: 3000,
    influxDB: process.env.INFLUX_DB ? process.env.INFLUX_DB : ''
};