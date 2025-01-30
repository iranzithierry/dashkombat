"use server";
import { getAuth } from "@/app/actions/auth.actions";
import { db } from "@/lib/db";
import { PaymentProvider } from "@/resources/constants";
import { siteConfig } from "@/resources/site";

interface WithdrawParams {
    points: number;
    phoneNumber: string;
    paymentProvider: PaymentProvider;
}

export async function withdrawPoints({ points, phoneNumber, paymentProvider }: WithdrawParams) {
    try {
        const session = await getAuth();
        if (!session) {
            throw new Error("Unauthorized");
        }

        const user = await db.user.findUniqueOrThrow({
            where: { id: session.id },
            include: { withdrawals: true },
        });

        if (!points || Number(points) < siteConfig.minimumPoints) {
            throw new Error("Withdrawn points are under the allowed minimum points");
        }

        if (!phoneNumber || !paymentProvider) {
            throw new Error("Phone number and payment provider are required");
        }

        // Validate phone number format (Rwanda)
        const phoneRegex = /^(?:\+250|07)[0-9]{8}$/;
        if (!phoneRegex.test(phoneNumber)) {
            throw new Error("Invalid phone number format");
        }

        const hasPendingWithdrawal = user.withdrawals.some((w) => w.status === "PENDING");
        if (hasPendingWithdrawal) {
            throw new Error("You have a pending withdrawal");
        }

        if (user.lastWithdrawalDate) {
            const lastWithdrawal = new Date(user.lastWithdrawalDate);
            const today = new Date();
            if (lastWithdrawal.toDateString() === today.toDateString()) {
                throw new Error("You can only withdraw once per day");
            }
        }

        if (user.pointsEarned < points) {
            throw new Error("Insufficient points");
        }
        await db.$transaction([
            db.withdrawal.create({
                data: {
                    userId: user.id,
                    amount: Math.floor(points / siteConfig.pointsDivider),
                    status: "PENDING",
                    phoneNumber,
                    paymentProvider,
                },
            }),
            db.user.update({
                where: { id: user.id },
                data: {
                    pointsEarned: { decrement: points },
                    lastWithdrawalDate: new Date(),
                },
            }),
        ]);
        return { success: true };
    } catch (error) {
        return { error: (error as Error).message };
    }
}
