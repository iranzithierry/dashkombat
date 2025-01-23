"use server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getAuth() {
    try {
        const user = await auth.api.getSession({
            headers: await headers(),
        });
        if (!user || !user.package) {
            return null;
        }
        return { ...user, package: user.package };
    } catch (error) {
        console.error("Error getting auth:", error);
        return null;
    }
}

export async function signOut() {
    await auth.api.signOut({
        headers: await headers(),
    });
}
