import { Hono } from "hono";
import { WSContext } from "hono/ws";
import Bootstrap from "./bootstrap";
import { createBunWebSocket } from "hono/bun";
import { ClicksController, ClicksPayload } from "./controllers/clicks";

const bootstrap = new Bootstrap();
export const redisConn = bootstrap.connection;

const app = new Hono().basePath("/api");

const { upgradeWebSocket, websocket } = createBunWebSocket();

export const wsConnections: { userId: string; ws: WSContext }[] = [];

app.get(
    "/ws",
    upgradeWebSocket((c) => {
        return {
            onMessage(e, ws) {
                const event = JSON.parse(`${e.data}`);
                switch (event.type) {
                    case "CLICK":
                        const { clicks, userId } = event.data as ClicksPayload;
                        new ClicksController().handle({ clicks, userId });
                        break;
                    default:
                        break;
                }
            },
            onOpen: (_, ws) => {
                console.log("Connection opened");
                const userId = ws.url?.searchParams.get("userId");
                if (userId) {
                    wsConnections.push({ userId, ws });
                }
            },
            onClose: (_, ws) => {
                console.log("Connection closed");
                const userId = ws.url?.searchParams.get("userId");
                if (userId) {
                    wsConnections.splice(
                        wsConnections.findIndex((ws) => ws.userId === userId),
                        1,
                    );
                }
            },
        };
    }),
);

export const getUserConnection = (userId: string) => {
    return wsConnections.find((ws) => ws.userId === userId)?.ws;
};
export default {
    fetch: app.fetch,
    port: process.env.PORT || 8300,
    websocket,
};
