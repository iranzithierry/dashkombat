import { Suspense } from "react";
import { Header } from "./components/header";
import LeaderBoard from "./components/leader-board";
import ClickPoints from "./components/click-points";
import { ClickContainer } from "./components/click-container";
import { VideoAd } from "./components/video-ad";
import Script from "next/script";
import { siteConfig } from "@/resources/site";

export const revalidate = 20;
export default async function Page() {
    return (
        <>
            {process.env.NODE_ENV == "production" && (
                <Script
                    async
                    src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${siteConfig.google.adClientId}`}
                    crossOrigin="anonymous"
                />
            )}
            <div className="w-full flex-1 font-bold flex flex-col select-none bg-stars ">
                <div className="min-h-[calc(100dvh-100px)] game-container flex flex-col">
                    <Header />
                    <ClickContainer />
                    <ClickPoints />
                </div>
                <VideoAd />
                <Suspense>
                    <LeaderBoard />
                </Suspense>
            </div>
        </>
    );
}
