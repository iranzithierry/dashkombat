const isProd = process.env.NODE_ENV == "production";
export const siteConfig = {
    name: "Click It",
    extra: {
        missingPfpFallback: "/images/missing.png",
        defaultPfp: "/images/panda.jpg",
    },
    protocols: {
        websocket: isProd ? "wss" : "ws",
        http: isProd ? "https" : "http",
        serverHost: isProd ? "click-it.ebuzzie.com" : "192.168.1.74:8000",
    },
    pointsDivider: 7.82
};
