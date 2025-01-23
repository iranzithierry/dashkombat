"use client";
import { IconGoldCoin, IconInstagram, IconX } from "@/components/icons";
import { Badge, Button, buttonStyles, Heading } from "@/components/ui";
import { IconClockFill, IconPeopleFill } from "justd-icons";
import React from "react";

const tasks = [
    {
        icon: IconX,
        title: "Follow our x @troy",
        points: 500,
    },
    {
        icon: IconInstagram,
        title: "Follow our instagram @troy",
        points: 500,
    },
    {
        icon: IconPeopleFill,
        title: "Invite 3 Friends",
        points: 500,
    },
    {
        icon: IconGoldCoin,
        title: "Earn 1000 points",
        points: 2000,
    },
    {
        icon: IconClockFill,
        title: "Play 2 hours",
        points: 500,
    },
];

export default function Page() {
    return (
        <div className="py-8 px-4 space-y-8 bg-stars flex-1">
            <div className="flex flex-col items-center">
                <Heading className="text-4xl">Tasks</Heading>
                <div className="text-muted-fg text-xl font-semibold">
                    Make our tasks to get more points
                </div>
            </div>
            <div className="space-y-4">
                {tasks.map((task, idx) => (
                    <Button
                        key={idx}
                        intent="secondary"
                        size="x-large"
                        className="w-full rounded-4xl flex  relative p-3"
                    >
                        <div className="flex items-center w-fit gap-2">
                            <task.icon className="size-16! shadow-2xl text-muted-fg" />
                            <div className="flex flex-col">
                                <Heading
                                    level={2}
                                    className="font-extrabold text-start line-clamp-1"
                                >
                                    {task.title}
                                </Heading>
                                <Badge intent="warning" className="flex items-center gap-2 w-fit">
                                    <p className="text-xl font-extrabold">
                                        {task.points.toLocaleString()}
                                    </p>
                                    <IconGoldCoin className="size-4!" />
                                </Badge>
                            </div>
                        </div>
                        <div
                            className={buttonStyles({
                                shape: "circle",
                                className: "ml-auto",
                            })}
                        >
                            Start
                        </div>
                    </Button>
                ))}
            </div>
        </div>
    );
}
