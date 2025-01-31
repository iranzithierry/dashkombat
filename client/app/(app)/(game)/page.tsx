import { Suspense } from "react";
import { Header } from "./components/header";
import LeaderBoard from "./components/leader-board";
import ClickPoints from "./components/click-points";
import { ClickContainer } from "./components/click-container";

export const revalidate = 20;
export default async function Page() {
    return (
        <div className="w-full flex-1 font-bold flex flex-col select-none bg-stars ">
            <div className="min-h-[calc(100dvh-100px)] game-container flex flex-col">
                <Header />
                <ClickContainer />
                <ClickPoints />
            </div>
            <Suspense>
                <LeaderBoard />
            </Suspense>
        </div>
    );
}
