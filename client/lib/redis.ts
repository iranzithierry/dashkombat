import Redis from "ioredis";

const REDIS_HOST = process.env.REDIS_HOST || "127.0.0.1";
const REDIS_PORT = process.env.REDIS_PORT || 6379;

const createRedisClient = () => {
    const client = new Redis(`redis://${REDIS_HOST}:${REDIS_PORT}`, {
        maxRetriesPerRequest: null
    });
    return client;
};

declare global {
    var redis: undefined | ReturnType<typeof createRedisClient>;
}
const redis = globalThis.redis ?? createRedisClient();

export { redis };

if (process.env.NODE_ENV !== "production") {
    globalThis.redis = redis
};
