"use client";
import { memo } from "react";
import { toast } from "sonner";
import { useClickStore } from "../click-store";
import { PointsDisplay } from "./points-display";
import { ClickStatus } from "./click-status";
import { CountdownDisplay } from "./countdown-display";

export const ClickContainer = memo(function ClickContainer() {
    const { handleClick, user, remainingClicks } = useClickStore();
    return (
        <div className="flex flex-col justify-between flex-1">
            <div className="mx-auto mt-4 flex items-center flex-col">
                {remainingClicks == 0 && user?.clickStats && (
                    <CountdownDisplay resetTimestamp={Number(user.clickStats.resetTimestamp)} />
                )}
                {user && <PointsDisplay />}
            </div>
            <button
                onClick={(e) => {
                    if (user) {
                        handleClick(e);
                    } else {
                        toast.info("Sign in to start clicking!");
                    }
                }}
                onTouchStart={(e) => e.preventDefault()}
                onContextMenu={(e) => e.preventDefault()}
                style={{
                    background: `url(/images/click-container.png) center no-repeat`,
                    backgroundSize: `100% 100%`,
                }}
                className="w-70 mx-auto top-glow h-70 shadow-[#1b1b2b] overflow-hidden ring-4 ring-[#364492]/20 cursor-pointer transition-transform shadow-2xl rounded-full items-center flex justify-center"
            />

            <ClickStatus />
        </div>
    );
});
