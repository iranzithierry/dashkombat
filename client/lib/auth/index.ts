import { db } from "@/lib/db";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { createAuthMiddleware, customSession } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { associateInvitee } from "@/app/actions/auth.actions";

export const auth = betterAuth({
    database: prismaAdapter(db, {
        provider: "postgresql",
    }),
    trustedOrigins: ["http://localhost:3000", "http://192.168.1.74:3000"],
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
        minPasswordLength: 6,
        requireEmailVerification: false,
    },
    emailVerification: {
        sendOnSignUp: false,
        autoSignInAfterVerification: true,
    },

    socialProviders: {
        google: {
            enabled: true,
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
    },
    account: {
        accountLinking: {
            enabled: true,
            trustedProviders: ["google"],
        },
    },
    plugins: [
        customSession(async (props) => {
            const session = await db.user.findUniqueOrThrow({
                where: {
                    id: props.user.id,
                },
                include: {
                    package: true,
                    clickStats: true,
                },
            });
            return session;
        }),
        nextCookies(),
    ],
    hooks: {
        after: createAuthMiddleware(async (ctx) => {
            if (ctx.path === "/sign-up/email" || ctx.path === "/callback/:id") {
                const session = ctx.context.newSession;
                if (session) {
                    const freePkg = await db.package.findFirst({ where: { slug: "free" } });
                    if (freePkg && !session.user.packageId) {
                        await db.user.update({
                            where: {
                                id: session.user.id,
                            },
                            data: {
                                packageId: freePkg.id,
                                purchasedPackageAt: new Date(),
                                inviteCode: [...crypto.getRandomValues(new Uint8Array(8))]
                                    .map((b) => b.toString(36))
                                    .join("")
                                    .toUpperCase(),
                            },
                        });
                    }
                    const inviteCode = ctx.getCookie("ref.id");
                    if (inviteCode) {
                        await associateInvitee(inviteCode, session.user.id);
                    }
                }
                return;
            }
        }),
    },
});
