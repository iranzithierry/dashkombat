import ms from "ms";
import { db } from "../db";
import { wsConnections } from "..";
import { didPackageExpired } from "@/utils";
export type JobsType = "process-points";

const pointsForUplineDivider = 10;
export default class PointsJob {
    async handle(job: JobsType, data: any) {
        switch (job) {
            case "process-points":
                await this.processPoints(data);
                break;
            default:
                break;
        }
    }

    async processPoints(data: { userId: string; points: number }) {
        const user = await db.user.findUnique({
            where: { id: data.userId },
            include: {
                package: true,
                clickStats: true,
            },
        });
        if (!user) throw new Error(`User ${data.userId} not found`);

        const wsConn = wsConnections.find((ws) => ws.userId === data.userId);

        const todayClicks = data.points;
        const maxClicksPerDay = user.package?.maxClicksPerDay || 0;

        let userStats = user.clickStats;
        if (!userStats) userStats = await this.createStats(user.id);

        const now = new Date();
        const resetTimestamp = Number(userStats?.resetTimestamp);
        const timeDifference = now.getTime() - resetTimestamp;

        const packageExpired = didPackageExpired(
            user.purchasedPackageAt,
            user.package?.durationDays as number,
        );
        if (packageExpired) {
            if (wsConn) {
                wsConn.ws.send(
                    JSON.stringify({
                        type: "Error",
                        data: {
                            message: "Your package has expired. Please purchase new package.",
                        },
                    }),
                );
            }
            return;
        }

        if (timeDifference > ms("1d")) {
            console.info(`Resetting today's clicks for user ${user.id}.`);
            userStats = await this.resetTodayClicks(user.id, now);
        }
        if (userStats?.todayClicks + todayClicks > maxClicksPerDay) {
            console.error(`User ${user.id} exceeded max clicks per day`);
            if (wsConn) {
                wsConn.ws.send(
                    JSON.stringify({
                        type: "error",
                        message: "You have exceeded your daily click limit.",
                    }),
                );
            }
            return;
        }
        await this.updateTodayClicks(user.id, todayClicks, user.package?.pointsPerClick || 0);
        console.log(`Processed ${todayClicks} clicks for user ${user.id}.`);
    }

    async updateTodayClicks(userId: string, todayClicks: number, pointsPerClick: number) {
        await db.clickStats.update({
            where: { userId },
            data: {
                todayClicks: {
                    increment: todayClicks,
                },
                user: {
                    update: {
                        pointsEarned: {
                            increment: pointsPerClick * todayClicks,
                        },
                        totalClicks: {
                            increment: todayClicks,
                        },
                        upline: {
                            update: {
                                pointsEarned: {
                                    increment:
                                        Math.ceil(todayClicks / pointsForUplineDivider) > 0
                                            ? Math.ceil(todayClicks / pointsForUplineDivider)
                                            : 1,
                                },
                            },
                        },
                    },
                },
            },
        });
    }

    async resetTodayClicks(userId: string, now: Date) {
        return await db.clickStats.update({
            where: { userId },
            data: {
                todayClicks: 0,
                resetTimestamp: now.getTime() + ms("1d"),
            },
        });
    }

    async createStats(userId: string) {
        return await db.clickStats.create({
            data: {
                userId,
                todayClicks: 0,
                resetTimestamp: Date.now() + ms("1d"),
            },
        });
    }
}
