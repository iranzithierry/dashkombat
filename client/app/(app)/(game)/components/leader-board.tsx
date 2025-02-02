import React from "react";
import { db } from "@/lib/db";
import { Avatar, Heading, Separator } from "@/components/ui";
import { IconGoldCoin } from "@/components/icons";
import { getLevelName } from "@/resources/data";

export default async function LeaderBoard() {
    const users = await db.user.findMany({
        orderBy: {
            pointsEarned: "desc",
        },
        take: 30,
    });
    if(users.length < 10) return null;
    return (
        <div className="p-2">
            <Separator />
            <div className="flex justify-center py-4">
                <Heading level={1}>Leaderboard</Heading>
            </div>
            {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-2">
                    <div className="flex items-center gap-3">
                        <Avatar size="large" src={user.image} initials={user.name[0]} />
                        <div className="text-left">
                            <div className="text-fg font-medium">{user.name}</div>
                            <div className="text-muted-fg text-sm">
                                {getLevelName(user.pointsEarned)}
                            </div>
                        </div>
                    </div>
                    <span className="font-bold text-sm flex items-center gap-1">
                        <IconGoldCoin className="w-6.5 h-6.5 text-pink" />+{user.pointsEarned.toLocaleString()}
                    </span>
                </div>
            ))}
        </div>
    );
}
