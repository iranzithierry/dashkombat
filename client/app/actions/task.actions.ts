"use server";

import { db } from "@/lib/db";
import { getAuth } from "./auth.actions";
import { revalidatePath } from "next/cache";

export async function claimTask(taskId: string) {
    try {
        const user = await getAuth();
        if (!user) throw new Error("Unauthorized");
        const existingClaim = await db.userTaskActivity.findFirst({
            where: {
                userId: user.id,
                taskId: taskId,
            },
        });

        if (existingClaim) {
            throw new Error("Task already claimed");
        }

        const task = await db.task.findUnique({
            where: { id: taskId },
        });

        if (!task) throw new Error("Task not found");
        await db.$transaction([
            db.userTaskActivity.create({
                data: {
                    userId: user.id,
                    taskId: taskId,
                },
            }),
            db.user.update({
                where: { id: user.id },
                data: {
                    pointsEarned: { increment: task.points },
                },
            }),
        ]);

        revalidatePath("/tasks");

        return { success: true };
    } catch (error) {
        return { error: (error as Error).message };
    }
}
