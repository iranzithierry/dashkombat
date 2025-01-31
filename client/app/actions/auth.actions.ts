"use server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { addMonths } from "date-fns";
import ms from "ms";
import { headers } from "next/headers";

export async function getAuth() {
    try {
        const user = await auth.api.getSession({
            headers: await headers(),
        });
        if (!user) {
            return null;
        }
        return { ...user, package: user.package };
    } catch (error) {
        console.error("Error getting auth:", error);
        return null;
    }
}

export async function signOut() {
    await auth.api.signOut({
        headers: await headers(),
    });
}

export async function banUser() {
    const user = await getAuth();
    if (!user) return;
    console.log("Banned user:", user.id, user.package?.maxClicksPerDay);
    const now = new Date();
    await db.user.update({
        where: { id: user.id },
        data: {
            banned: true,
            banReason: "Click Cheating",
            banExpires: addMonths(now, 3),
            clickStats: {
                update: {
                    data: {
                        todayClicks: user.package?.maxClicksPerDay,
                        resetTimestamp: addMonths(now, 3).getTime(),
                    },
                },
            },
        },
    });
}

export const associateInvitee = async (inviteCode: string, userId: string) => {
    const upline = await db.user.findFirst({ where: { inviteCode } });
    if (upline) {
        await db.user.update({
            where: { id: userId },
            data: {
                uplineId: upline.id,
            },
        });
    }
};
