import { Header } from "./components/header";
import ClickPoints from "./components/click-points";
import { ClickContainer } from "./components/click-container";

export default function Page() {
    return (
        <div
            className="w-full flex-1 font-bold flex flex-col select-none bg-stars"
        >
            <Header />
            <ClickContainer />
            <ClickPoints />
        </div>
    );
}
