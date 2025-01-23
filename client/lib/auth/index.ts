import { db } from "@/lib/db";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { customSession } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";

export const auth = betterAuth({
    database: prismaAdapter(db, {
        provider: "postgresql"
    }),
    trustedOrigins: [
        "http://localhost:3000",
        "http://192.168.1.74:3000",
        "https://click-it-one.vercel.app"
    ],
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
        minPasswordLength: 6,
        requireEmailVerification: false
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
        }
    },
    account: {
        accountLinking: {
            enabled: true,
            trustedProviders: ["google"]
        }
    },
    plugins: [
        customSession(async (props) => {
            const session = await db.user.findUniqueOrThrow({
                where: {
                    id: props.user.id
                },
                include: {
                    package: true,
                    clickStats: true,
                }
            })
            return session
        }),
        nextCookies()

    ],
});