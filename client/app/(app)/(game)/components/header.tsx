"use client";
import { siteConfig } from "@/resources/site";
import { useClickStore } from "../click-store";
import { cn, formatCurrency } from "@/lib/utils";
import { IconGoldCoin } from "@/components/icons";
import AuthTrigger from "@/components/auth-trigger";
import { memo, useEffect, useRef, useMemo } from "react";
import { getLevelName, levelNames } from "@/resources/data";

const ProfilePicture = memo(
    ({ userPfp, progressPercentage }: { userPfp: string | null; progressPercentage: number }) => (
        <div
            className="relative flex items-center overflow-hidden w-[52px] h-[52px] rounded-full p-[3px]"
            style={{
                background: `conic-gradient(from 0deg, red ${progressPercentage}%, white ${progressPercentage}%)`,
            }}
        >
            <div className="p-[1px] bg-white rounded-full">
                <img
                    src={userPfp || siteConfig.extra.defaultPfp}
                    className="rounded-full w-full h-full object-cover"
                    alt="Profile"
                />
            </div>
        </div>
    ),
);

const UserInfo = memo(({ name, levelName }: { name: string; levelName: string }) => (
    <div className="flex flex-col ml-3">
        {name}
        <span className="font-bold text-sm flex items-center gap-1">
            <IconGoldCoin className="w-6.5 h-6.5 text-pink" />
            {levelName}
        </span>
    </div>
));

const ProfitDisplay = memo(({ points }: { points: number }) => (
    <div className="flex items-center inset-ring inset-ring-ring/10 rounded-full px-4 py-0.5 bg-secondary">
        <div className="flex-1 text-center">
            <p className="text-xs text-[#85827d] font-medium">Total profits</p>
            <div className="flex items-center justify-center space-x-1">
                <p className="text-sm">{formatCurrency(points / siteConfig.pointsDivider)}</p>
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
                            <UserInfo name={user.name} levelName={levelName} />
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
