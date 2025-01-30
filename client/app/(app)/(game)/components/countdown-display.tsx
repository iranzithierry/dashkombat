"use client";
import { memo, useEffect, useState } from "react";
import { formatCountdown, formatResetTime, getTimeRemaining } from "@/lib/utils/time";
import { resetClickingTimeout } from "@/app/actions/game.actions";

export const CountdownDisplay = memo(function CountdownDisplay({
    resetTimestamp,
}: {
    resetTimestamp: number;
}) {
    const [countdown, setCountdown] = useState("");

    useEffect(() => {
        const timer = setInterval(() => {
            const { total, hours, minutes, seconds } = getTimeRemaining(resetTimestamp);
            if (total <= 0) {
                resetClickingTimeout().then((done) => {
                    if (done && typeof window !== "undefined") {
                        window.location.reload();
                    }
                });
                clearInterval(timer);
                setCountdown("00:00:00");
                return;
            }
            setCountdown(formatCountdown(hours, minutes, seconds));
        }, 1000);

        return () => clearInterval(timer);
    }, [resetTimestamp]);

    return (
        <>
            <h2>Resets {formatResetTime(resetTimestamp).toLowerCase()}</h2>
            <p className="text-xs font-mono">{countdown}</p>
        </>
    );
});
