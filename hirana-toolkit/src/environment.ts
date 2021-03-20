export const environments = {
    bot: {
        enabled: true,
        channels: [
            "#main",
            "#underc0de"
        ],
        server: "irc.hirana.net",
        botName: "HiranaBot",
        password: '',
        owners: [
            "alex",
            "gabriela-"
        ]
    },
    avatarStorageKey: 'avatar-custom',
    storageLocation: './dataStored',
    avatarHttpTimeout: 3000,
    urlCacheKey: 'url-processor',
    urlHttpTimeout: 1500,
    urlMaxBodyLength: 35000,
    rcStorageKey: 'rangos-custom',
    gcStorageKey: 'global-custom',
};