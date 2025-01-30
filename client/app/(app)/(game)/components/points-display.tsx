"use client";
import { memo } from "react";
import { useClickStore } from "../click-store";
import { IconGoldCoin } from "@/components/icons";

export const PointsDisplay = memo(function PointsDisplay() {
    const points = useClickStore((state) => state.points);
    
    
    return (
        <div className="px-4 py-2 flex items-center gap-2">
            <IconGoldCoin className="size-6!" />
            <p className="text-4xl text-fg">{points.toLocaleString()}</p>
        </div>
    );
});
