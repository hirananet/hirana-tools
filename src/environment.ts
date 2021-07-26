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

    avatarTTL: 1800, // 30 minutos
    jdenticonTTL: 7200, // dos horas
    urlTTL: 3600, // 1 hora
    userAgent: 'Hirana-Spider',

    bankTokens: process.env.BANK_TOKENS && JSON.parse(process.env.BANK_TOKENS) ? JSON.parse(process.env.BANK_TOKENS) : [] 
    // [{"clientID": "virgilio", "token": "R5G3YS2VXPY1W9WG409PLV00YVPO5PGN"}, {"clientID": "hirana", "token": "B9MKYCYESJ0MNXQH9F5VAP04W9HIF5SH"}]
};