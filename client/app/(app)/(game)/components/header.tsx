"use client";
import { siteConfig } from "@/resources/site";
import { useClickStore } from "../click-store";
import { cn, formatCurrency } from "@/lib/utils";
import { IconGoldCoin } from "@/components/icons";
import AuthTrigger from "@/components/auth-trigger";
import { memo, useEffect, useRef, useMemo } from "react";
import { getLevelName, levelNames } from "@/resources/data";
import { Avatar } from "@/components/ui";
import { AnimatedCounter } from "react-animated-counter";

const ProfilePicture = memo(
    ({ userPfp, progressPercentage }: { userPfp: string | null; progressPercentage: number }) => (
        <div
            className="relative ring ring-white/20  flex items-center justify-between overflow-hidden rounded-full p-[3px]"
            style={{
                background: `conic-gradient(from 0deg, #eb9532 ${Math.ceil(progressPercentage)}%, black ${Math.ceil(progressPercentage)}%)`,
            }}
        >
            <div className="p-[1px] bg-white mx-auto rounded-full">
                <Avatar size="large" src={userPfp || siteConfig.extra.defaultPfp} alt="Profile" />
            </div>
        </div>
    ),
);

const ProfitDisplay = memo(({ points }: { points: number }) => (
    <div className="flex items-center inset-ring inset-ring-ring/10 rounded-full px-3 py-0  bg-secondary">
        <div className="flex-1 text-center space-y-0.5">
            <p className="text-xs text-muted-fg font-medium leading-none">Total profits</p>
            <div className="flex items-center justify-center">
                <AnimatedCounter
                    includeCommas
                    incrementColor="var(--color-warning)"
                    value={points}
                    color="white"
                    fontSize="12px"
                />
                {/* <p className="text-xs leading-none">{formatCurrency(points / siteConfig.pointsDivider)}</p> */}
            </div>
        </div>
    </div>
));

export const Header = memo(function Header() {
    const alreadyMounted = useRef(false);
    const { user, points, initialize } = useClickStore();

    useEffect(() => {
        if (!alreadyMounted.current) {
            initialize();
            alreadyMounted.current = true;
        }
    }, []);

    const { progressPercentage, levelName } = useMemo(() => {
        const totalLevels = levelNames.length;
        const currentLevel = getLevelName(points);
        const currentLevelIndex = levelNames.indexOf(currentLevel) + 1;
        return {
            progressPercentage: ((currentLevelIndex / totalLevels) * 100).toFixed(2),
            levelName: currentLevel,
        };
    }, [points]);

    return (
        <div className="p-4 z-10">
            <div
                className={cn(
                    "flex justify-between mx-auto bg-white/5 backdrop-blur-3xl p-2",
                    "rounded-full",
                )}
            >
                {user ? (
                    <>
                        <div className="flex items-center gap-1">
                            <ProfilePicture
                                userPfp={user.image}
                                progressPercentage={Number(progressPercentage)}
                            />
                            <div className="flex flex-col ml-2">
                                {user.name}
                                <span className="font-bold text-muted-fg text-xs flex items-center gap-1">
                                    {levelName}
                                </span>
                            </div>
                        </div>
                        <ProfitDisplay points={points} />
                    </>
                ) : (
                    <AuthTrigger />
                )}
            </div>
        </div>
    );
});
