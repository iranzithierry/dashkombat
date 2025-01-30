"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    IconBrandCash,
    IconChecklist,
    IconCirclePersonFill,
    IconPackageFill,
    IconPersonAddedFill,
} from "justd-icons";
import { IconFingerPrint } from "./icons";

const menus = [
    {
        name: "Invite",
        path: "/invite",
        icon: IconPersonAddedFill,
    },
    {
        name: "Tasks",
        path: "/tasks",
        icon: IconChecklist,
    },
    {
        name: "Play",
        path: "/",
        icon: IconFingerPrint,
    },
    {
        name: "Packages",
        icon: IconPackageFill,
        path: "/packages",
    },
    {
        name: "Wallet",
        path: "/wallet",
        icon: IconBrandCash,
    },
];

export function Navigation() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <nav className="fixed bottom-0 left-0 right-0 p-2 z-10">
            <div className="flex px-2 bg-muted shadow-2xl shadow-muted inset-ring inset-ring-ring/10 inset-shadow-xs justify-around items-center mx-auto rounded-full">
                {menus.map((menu, index) => (
                    <Link
                        key={index}
                        href={menu.path}
                        className={`flex  py-2 transition w-full flex-col items-center justify-center gap-1 ${isActive(menu.path) ? "text-fg [&>svg]:stroke-12 fill-fg font-extrabold" : "text-muted-fg"}`}
                    >
                        <menu.icon className="w-6 h-6" />
                        <span className="text-xs">{menu.name}</span>
                        {isActive(menu.path) && (
                            <div className="w-[80%] mx-auto h-1 bg-warning rounded-full"></div>
                        )}
                    </Link>
                ))}
            </div>
        </nav>
    );
}
