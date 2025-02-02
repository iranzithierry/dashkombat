const isProd = process.env.NODE_ENV == "production";

// dashkombat.com
export const siteConfig = {
    name: "Dash Kombat",
    extra: {
        missingPfpFallback: "/images/missing.png",
        defaultPfp: "/images/pixel.png",
    },
    protocols: {
        websocket: isProd ? "wss" : "ws",
        http: isProd ? "https" : "http",
        serverHost: isProd ? "click-it.ebuzzie.com" : "192.168.1.74:8300",
    },
    pointsDivider: 7.82,
    minimumPoints: 100_000,
    google: {
        adClientId: "ca-pub-1195424807027193",
        adSlot: "1927489489",
        

    }

};
