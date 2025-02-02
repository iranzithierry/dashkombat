import { Suspense } from "react";
import { Header } from "./components/header";
import LeaderBoard from "./components/leader-board";
import ClickPoints from "./components/click-points";
import { ClickContainer } from "./components/click-container";
import { VideoAd } from "./components/video-ad";
import { useClickStore } from "./click-store";
import Script from "next/script";

export const revalidate = 20;
export default async function Page() {
    return (
        <>
            <Script
                async
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1195424807027193"
                crossOrigin="anonymous"
            />
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
