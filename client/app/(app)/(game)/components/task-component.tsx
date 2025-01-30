"use client";
import React from "react";
import { IconGoldCoin } from "@/components/icons";
import { Badge, Button, buttonStyles, Heading, ProgressCircle } from "@/components/ui";
import { Task, UserTaskActivity } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { claimTask } from "@/app/actions/task.actions";
import { cn, delay } from "@/lib/utils";

interface TaskComponentProps {
    task: Task;
    userTasks?: UserTaskActivity[];
}

export default function TaskComponent({ task, userTasks }: TaskComponentProps) {
    const { mutate: handleClaim, isPending: isClaimLoading } = useMutation({
        mutationFn: async () => {
            if (!isClaimed && !isClaimLoading) {
                await delay(10000)
                claimTask(task.id);
            }
        },
    });
    const isClaimed = userTasks?.some((ut) => ut.taskId === task.id);

    return (
        <Button
            key={task.id}
            intent={"secondary"}
            size="x-large"
            shape="circle"
            className="w-full disabled:!border disabled:!border-white/10 flex relative p-3 hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed"
            onPress={() => handleClaim()}
            isDisabled={isClaimed || isClaimLoading}
        >
            <Heading level={2} className="font-extrabold text-start leading-none">
                {task.name}
            </Heading>
            <div
                className={cn(
                    buttonStyles({
                        shape: "circle",
                        className: "ml-auto",
                        size: "small",
                        intent: isClaimed ? "success" : "secondary",
                    }),
                    isClaimed ? "cursor-not-allowed" : "cursor-auto",
                    "pr-1 shrink-0",
                )}
            >
                <span>{isClaimed ? "Claimed" : "Start"}</span>
                <Badge
                    intent="secondary"
                    className={cn(isClaimed ? "cursor-not-allowed" : "cursor-auto", "ml-auto")}
                >
                    {isClaimLoading ? (
                        <ProgressCircle isIndeterminate className="!size-4" />
                    ) : (
                        <>
                            <p className="text-xl font-extrabold">{task.points.toLocaleString()}</p>
                            <IconGoldCoin className="size-4!" />
                        </>
                    )}
                </Badge>
            </div>
        </Button>
    );
}
