import Redis from "ioredis";
import { Worker } from "bullmq";
import PointsJob, { JobsType } from "./jobs/points";

export default class Bootstrap {
    public connection: Redis;
    public REDIS_HOST: string;
    public REDIS_PORT: string;

    constructor() {
        this.REDIS_HOST = process.env.REDIS_HOST || "127.0.0.1";
        this.REDIS_PORT = process.env.REDIS_PORT || "6379";

        this.startRedisConnection();
        this.startWorkers();
    }

    public startRedisConnection = () => {
        this.connection = new Redis(`redis://${this.REDIS_HOST}:${this.REDIS_PORT}`, {
            maxRetriesPerRequest: null,
        });
    };
    public startWorkers = () => {
        new Worker(
            "pointsQueue",
            async (job) => {
                const pointsJob = new PointsJob();
                pointsJob.handle(job.name as JobsType, job.data);
            },
            {
                connection: this.connection,
                concurrency: 5,
                removeOnComplete: { count: 1000 },
                removeOnFail: { count: 5000 },
            },
        );
    };
}
