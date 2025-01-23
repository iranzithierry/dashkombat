"use server";
import ms from "ms";
import { db } from "@/lib/db";
import { getAuth } from "./auth.actions";

export const getPoints = async () => {
    const user = await getAuth();
    if (!user) return null;
    const points = user.pointsEarned;
    const remainingClicks =
        (user.package?.maxClicksPerDay || 0) - (user.clickStats?.todayClicks ?? 0);
    return { points, remainingClicks };
};
export const resetClickingTimeout = async () => {
    const user = await getAuth();
    if (!user) return null;
    const now = new Date();
    const resetTimestamp = Number(user.clickStats?.resetTimestamp);

    if (now.getTime() > resetTimestamp) {
        await db.clickStats.update({
            where: { userId: user.id },
            data: {
                todayClicks: 0,
                resetTimestamp: now.getTime() + ms("1d"),
            },
        });
        return true;
    }
    return false;
};
