"use client";
import { memo } from "react";
import { IconGoldCoin } from "@/components/icons";
import { useClickStore } from "../click-store";

export const PointsDisplay = memo(function PointsDisplay() {
    const points = useClickStore((state) => state.points);
    
    return (
        <div className="px-4 py-2 flex items-center gap-2">
            <IconGoldCoin className="size-6!" />
            <p className="text-4xl text-white">{points.toLocaleString()}</p>
        </div>
    );
});
