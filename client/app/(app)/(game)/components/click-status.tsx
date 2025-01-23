"use client";
import { memo } from "react";
import { IconFlashFill } from "justd-icons";
import { useClickStore } from "../click-store";

export const ClickStatus = memo(function ClickStatus() {
    const { user, remainingClicks } = useClickStore();
    return (
        <div className="flex  mx-auto w-fit space-x-1 items-center rounded-full p-3 backdrop-blur-lg">
            {user && <IconFlashFill className="size-4.5 text-pink" />}
            <p className="text-lg font-extrabold tracking-wider">
                {user ? (
                    <>
                        <span>
                            {((user?.package?.maxClicksPerDay as number) - remainingClicks)
                                ?.toLocaleString()
                                .replaceAll(",", " ")}
                        </span>
                        <span>&nbsp;/&nbsp;</span>
                        <span className="text-muted-fg">
                            {user?.package?.maxClicksPerDay.toLocaleString().replaceAll(",", " ")}
                        </span>
                    </>
                ) : (
                    <>
                        --<span>&nbsp;/&nbsp;</span>--
                    </>
                )}
            </p>
        </div>
    );
});
