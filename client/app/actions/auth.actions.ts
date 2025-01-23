"use server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

export async function getAuth() {
    const user = await auth.api.getSession({
        headers: await headers(),
    });
    if (!user) {
        notFound();
    } else if (!user.package) {
        redirect("/packages");
    }
    const packageNonNull = user.package as NonNullable<typeof user.package>;
    return { ...user, package: packageNonNull };
}

export async function signOut() {
    await auth.api.signOut({
        headers: await headers(),
    });
}
