"use client";
import React from "react";
import { useClickStore } from "../click-store";

export default function ClickPoints() {
    const { clicks, user } = useClickStore();
    return (
        <>
            {clicks.map((click) => (
                <div
                    key={click.id}
                    className="absolute text-3xl font-bold opacity-0 text-white pointer-events-none"
                    style={{
                        top: `${click.y - 42}px`,
                        left: `${click.x - 28}px`,
                        animation: `float 0.5s ease-out`,
                    }}
                >
                    +{user?.package?.pointsPerClick}
                </div>
            ))}
        </>
    );
}
