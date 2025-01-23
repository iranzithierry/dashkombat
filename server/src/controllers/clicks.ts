import { getUserConnection } from "..";
import { PointsQueue } from "../queues/points";

export interface ClicksPayload {
    clicks: { id: string; x: number; y: number }[];
    userId: string;
}
export class ClicksController {
    public async handle(data: ClicksPayload) {
        try {
            // TODO: analyze the x and y coordinates to determine if the click is valid [✔]
            const results = this.analyzeClickCoordinates(data.clicks);
            if (results.status === "error") {
                // TODO: Ban user also in DB
                const userWsConn = getUserConnection(data.userId);
                if (userWsConn) {
                    userWsConn.send(
                        JSON.stringify({
                            type: "SPAMMING",
                            data: {
                                message: results.message,
                            },
                        }),
                    );
                }
            }
            await new PointsQueue().add("process-points", {
                userId: data.userId,
                points: new Set(data.clicks.map((click) => click.id)).size,
            });
        } catch (error) {
            console.error("Error processing clicks:", error);
        }
    }

    public analyzeClickCoordinates(clicks: ClicksPayload["clicks"]): {
        status: "error" | "success";
        message: string;
        reason: string;
        facts: any;
    } {
        const data: number[] = [];
        for (let i = 0; i < clicks.length; i++) {
            const click = clicks[i];
            if (click.x == 0 || click.y == 0) {
                // cheating detected
                return {
                    status: "error",
                    message: "Cheating detected",
                    reason: "Invalid coordinates",
                    facts: {
                        x: click.x,
                        y: click.y,
                    },
                };
            }
            const prevClickedTime = clicks[i - 1]?.id.split(":")[0];
            if (!prevClickedTime) continue;
            const timeDifference = parseInt(click.id.split(":")[0]) - parseInt(prevClickedTime);
            data.push(timeDifference);
        }
        const timeDifferences = data
            .sort((a, b) => a - b)
            .map((item) => item)
            .filter((timeDifference) => !isNaN(timeDifference));

        const mean =
            timeDifferences.reduce((sum, value) => sum + value, 0) / timeDifferences.length;

        const standardDeviation = Math.sqrt(
            timeDifferences
                .map((value) => Math.pow(value - mean, 2))
                .reduce((sum, value) => sum + value, 0) / timeDifferences.length,
        );
        const filteredTimeDifferences = timeDifferences.filter(
            (value) => Math.abs(value - mean) <= 2 * standardDeviation,
        );
        const averageDelay =
            filteredTimeDifferences.reduce((sum, value) => sum + value, 0) /
            filteredTimeDifferences.length;

        const normalAverageDelay = 95;
        if (normalAverageDelay > averageDelay) {
            console.error("Cheating detected");
            return {
                status: "error",
                message: "Cheating detected",
                reason: "Average delay between clicks is too low",
                facts: {
                    averageDelay,
                    normalAverageDelay,
                },
            };
        }
        return {
            status: "success",
            message: "No cheating detected",
            reason: "Average delay between clicks is within normal range",
            facts: {
                averageDelay,
                normalAverageDelay,
            },
        };
    }
}
