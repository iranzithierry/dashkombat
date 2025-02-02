import { toast } from "sonner";
import { create } from "zustand";
import { banUser, getAuth } from "@/app/actions/auth.actions";
import { getPoints } from "@/app/actions/game.actions";
import { siteConfig } from "@/resources/site";
import { didPackageExpired } from "@/lib/utils";
interface ClickStore {
    user: Awaited<ReturnType<typeof getAuth>>;
    points: number;
    clicks: { id: string; x: number; y: number }[];
    remainingClicks: number;
    websocket: WebSocket | null;
    clickTimeout: NodeJS.Timeout | null;
    showAd: boolean;
    setShowAd: (show: boolean) => void;
    initialize: () => Promise<void>;
    handleClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    handleWebsocket: VoidFunction;
}

const MAX_BATCH_SIZE = 20;

const generateId = () => {
    return `${Date.now()}:${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
};

export const useClickStore = create<ClickStore>((set, get) => ({
    user: null as any,
    points: 0,
    clicks: [],
    remainingClicks: 0,
    websocket: null,
    clickTimeout: null,
    showAd: false,
    setShowAd: (show) => set({ showAd: show }),
    initialize: async () => {
        try {
            const user = await getAuth();
            if (user) {
                if (!user.package && typeof window !== "undefined") {
                    window.location.replace("/packages");
                    return;
                }
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
        const { points, clicks, remainingClicks, user, clickTimeout } = get();
        if (remainingClicks <= 0 || user?.banned) {
            toast.error(
                user?.banned
                    ? "You were banned from clicking due to click spamming"
                    : "You have reached your daily limit of clicks.",
            );
            return;
        } else if (user) {
            if (clickTimeout) clearTimeout(clickTimeout);
            if (user.purchasedPackageAt) {
                const packageExpired = didPackageExpired(
                    user.purchasedPackageAt,
                    user.package?.durationDays as number,
                );
                if (packageExpired) {
                    toast.error("Your package has expired. Please purchase a new package.");
                    window.location.replace("/packages");
                    return;
                }
            }
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
            } else {
                const timeout = setTimeout(() => {
                    const currentClicks = get().clicks;
                    if (currentClicks.length > 0) {
                        get().websocket?.send(
                            JSON.stringify({
                                type: "CLICK",
                                data: {
                                    clicks: currentClicks,
                                    userId: user.id,
                                },
                            }),
                        );
                        set({ clicks: [], clickTimeout: null });
                    }
                }, 3000);

                set({ clickTimeout: timeout });
            }
        }
    },
    handleWebsocket: () => {
        const { websocket, user } = get();
        if (!websocket) {
            const url = `${siteConfig.protocols.websocket}://${siteConfig.protocols.serverHost}/api/ws?userId=${user?.id}`;
            const ws = new WebSocket(url);
            ws.onmessage = async (event) => {
                const data = JSON.parse(event.data);
                switch (data.type) {
                    case "SPAMMING":
                        toast.error(data.data.message);
                        await banUser();
                        typeof window !== "undefined" && window.location.reload();
                        break;
                    case "SHOW_AD":
                        set({ showAd: true });
                        break;
                    default:
                        break;
                }
            };
            ws.onopen = () => {
                // console.log("WebSocket connection opened.");
                set({ websocket: ws });
                setTimeout(() => { set({ showAd: true }) }, 4000); // TESTING
            };
            ws.onclose = () => {
                // console.log("WebSocket connection closed.");
                set({ websocket: null });
            };
        }
    },
}));
