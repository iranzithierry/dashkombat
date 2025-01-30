"use client";
import React from "react";
import { Button } from "@/components/ui";
import { getAuth } from "@/app/actions/auth.actions";
import { siteConfig } from "@/resources/site";
import { toast } from "sonner";

export default function InviteButton({ user }: { user: Awaited<ReturnType<typeof getAuth>> }) {
    const share = async () => {
        if (typeof window !== "undefined") {
            const shareData = {
                title: user
                    ? `Join me on ${siteConfig.name} - Click & Earn Real Money! 💰`
                    : `${siteConfig.name} - Turn Clicks Into Cash! 🎮`,
                text: "Join this awesome clicking game where you can earn real money. Click, collect points, and withdraw anytime! 💸",
                url: `${window.location.origin}/sign-up?refId=${user?.inviteCode}`,
            };
            try {
                await window.navigator.share(shareData);
            } catch (error) {
                try {
                    await window.navigator.clipboard
                        .writeText(shareData.url)
                        .then(() => toast.success("Invite link copied to clipboard"));
                } catch (error) {
                    toast.error("Error sharing or copying the invitee link");
                }
            }
        }
    };
    return (
        <Button
            intent="warning"
            size="large"
            className={
                "mx-auto font-extrabold !ring-warning/90 ring-2 !px-14 !shadow-warning !shadow-2xl"
            }
            shape="circle"
            onPress={share}
        >
            Send Invite
        </Button>
    );
}
