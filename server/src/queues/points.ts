import { Queue } from "bullmq";
import { redisConn } from "..";

export class PointsQueue {
    private queue: Queue;
    public add: Queue["add"];

    constructor() {
        this.queue = new Queue("pointsQueue", {
            connection: redisConn,
            defaultJobOptions: {
                attempts: 2,
                backoff: {
                    type: "exponential",
                    delay: 5000,
                },
                removeOnComplete: true,
                removeOnFail: true,
            },
        });
        this.add = this.queue.add.bind(this.queue);
    }
}
