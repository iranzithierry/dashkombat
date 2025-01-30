"use client";
import { memo } from "react";
import { useClickStore } from "../click-store";
import { IconGoldCoin } from "@/components/icons";
import { AnimatedCounter } from  'react-animated-counter';

export const PointsDisplay = memo(function PointsDisplay() {
    const points = useClickStore((state) => state.points);
    
    
    return (
        <div className="px-4 py-2 flex items-center gap-2">
            <IconGoldCoin className="size-6!" />
            <AnimatedCounter includeCommas incrementColor="var(--color-warning)" value={points} color="white" fontSize="40px" />
            {/* <p className="text-4xl text-fg">{points.toLocaleString()}</p> */}
        </div>
    );
});
