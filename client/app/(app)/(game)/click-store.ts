import { toast } from "sonner";
import { create } from "zustand";
import { getAuth } from "@/app/actions/auth.actions";
import { getPoints } from "@/app/actions/game.actions";
import { LocalStorageClient } from "@/lib/utils/localstorage";
import { siteConfig } from "@/resources/site";
interface ClickStore {
    user: Awaited<ReturnType<typeof getAuth>>;
    points: number;
    clicks: { id: string; x: number; y: number }[];
    remainingClicks: number;
    websocket: WebSocket | null;
    initialize: () => Promise<void>;
    handleClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    handleWebsocket: VoidFunction;
}

const MAX_BATCH_SIZE = 5;
const localstorageClient = new LocalStorageClient();

const generateId = () => {
    return `${Date.now()}:${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
};

export const useClickStore = create<ClickStore>((set, get) => ({
    user: null as any,
    points: 0,
    clicks: [],
    remainingClicks: 0,
    websocket: null,
    initialize: async () => {
        try {
            const user = await getAuth();
            if (user) {
                const { remainingClicks, points } = (await getPoints()) as NonNullable<
                    Awaited<ReturnType<typeof getPoints>>
                >;
                set({ remainingClicks, points, user });
                get().handleWebsocket();
            }
        } catch (error) {
            console.error("Error initializing click store:", error);
        }
    },
    handleClick: (e) => {
        const { points, clicks, remainingClicks, user } = get();
        if (remainingClicks <= 0) {
            toast.error("You have reached your daily limit of clicks.");
            return;
        } else if (user) {
            const mergedClicks = [...clicks, { id: generateId(), x: e.pageX, y: e.pageY }];
            set({
                remainingClicks: remainingClicks - 1,
                // @ts-ignore
                points: points + user.package.pointsPerClick,
                clicks: mergedClicks,
            });

            const clickContainer = e.currentTarget;
            const rect = clickContainer.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            clickContainer.style.transform = `perspective(2000px) rotateX(${-y / 8}deg) rotateY(${x / 8}deg)`;

            setTimeout(() => {
                clickContainer.style.transform = "";
            }, 100);

            if (clicks.length + 1 >= MAX_BATCH_SIZE) {
                get().websocket?.send(
                    JSON.stringify({
                        type: "CLICK",
                        data: {
                            clicks: mergedClicks,
                            userId: user.id,
                        },
                    }),
                );
                set({ clicks: [] });
            }
        }
    },
    handleWebsocket: () => {
        const { websocket, user } = get();
        if (!websocket) {
            const url = `${siteConfig.protocols.websocket}://${siteConfig.protocols.serverHost}/api/ws?userId=${user?.id}`;
            const ws = new WebSocket(url);
            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                switch (data.type) {
                    case "SPAMMING":
                        set({ remainingClicks: 0, points: get().points - 100 });
                        toast.error(data.data.message);
                        localstorageClient.setItem("spamming", true);
                        break;
                    default:
                        break;
                }
            };
            ws.onopen = () => {
                console.log("WebSocket connection opened.");
                set({ websocket: ws });
            };
            ws.onclose = () => {
                console.log("WebSocket connection closed.");
                set({ websocket: null });
            };
        }
    },
}));
