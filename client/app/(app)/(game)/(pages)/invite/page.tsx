
import React from "react";
import { db } from "@/lib/db";
import { Button, Avatar } from "ui";
import { getLevelName } from "@/resources/data";
import { IconGoldCoin } from "@/components/icons";
import { getAuth } from "@/app/actions/auth.actions";
import InviteButton from "../../components/invite-button";
import EmptyState from "@/components/empty-state";

export const dynamic = 'force-dynamic';
export default async function InviteScreen() {
    const user = await getAuth();
    if (!user) return <div>You must be logged in to view this page.</div>;
    const friends = await db.user.findMany({
        where: {
            uplineId: user?.id,
        },
    });
    return (
        <div className="w-full space-y-4 bg-stars">
            <div className="relative h-32 brightness-75 bg-gradient-to-b from-warning/40 to-transparent">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="relative">
                        <Avatar
                            size="extra-large"
                            className="absolute -left-8 ring-2 ring-warning/40"
                            src={"/images/random-avatars/1.jpg"}
                        />
                        <Avatar
                            size="small"
                            className="absolute -left-16 -top-12 ring-2 ring-warning/40"
                            src={"/images/random-avatars/2.jpg"}
                        />
                        <Avatar
                            size="large"
                            className="absolute left-8 -top-8 ring-2 ring-warning/40"
                            src={"/images/random-avatars/3.jpg"}
                        />
                        <Avatar
                            size="small"
                            className="absolute left-5 top-2 ring-2 ring-warning/40"
                            src={"/images/random-avatars/4.jpg"}
                        />
                        <Avatar
                            size="small"
                            className="absolute right-12 -top-0 ring-2 ring-warning/40"
                            src={"/images/random-avatars/5.jpg"}
                        />
                    </div>
                </div>
            </div>
            <div className="space-y-4 text-center px-6">
                <h1 className="text-3xl font-bold text-fg">Invite friends</h1>
                <p className="text-muted-fg">You and your friend will get bonuses</p>
                <InviteButton user={user} />
            </div>
            <div className="space-y-4 mt-8 px-6">
                {friends
                    .sort((a, b) => b.pointsEarned - a.pointsEarned)
                    .map((friend) => (
                        <div key={friend.id} className="flex items-center justify-between p-2">
                            <div className="flex items-center gap-3">
                                <Avatar size="large" src={friend.image} initials={friend.name[0]} />
                                <div className="text-left">
                                    <div className="text-fg font-medium">{friend.name}</div>
                                    <div className="text-muted-fg text-sm">
                                        {getLevelName(friend.pointsEarned)}
                                    </div>
                                </div>
                            </div>
                            <span className="font-bold text-sm flex items-center gap-1">
                                <IconGoldCoin className="w-6.5 h-6.5 text-pink" />+
                                {user.pointsEarned.toLocaleString()}
                            </span>
                        </div>
                    ))}
                {friends.length == 0 && <EmptyState title="friends" />}
            </div>
        </div>
    );
}
