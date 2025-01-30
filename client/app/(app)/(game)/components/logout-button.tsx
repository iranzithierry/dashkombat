"use client";
import React from "react";
import { Button } from "@/components/ui";
import { authClient } from "@/lib/auth/auth.client";

export default function LogoutButton() {
    return (
        <Button
            onPress={async () => {
                await authClient.signOut();
                typeof window !== "undefined" && window.location.replace("/");
            }}
            intent="danger"
            className="w-full"
        >
            Logout
        </Button>
    );
}
