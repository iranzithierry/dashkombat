import React from "react";

import { Button } from "ui";
import { IconBrandGoogle } from "justd-icons";
import { authClient } from "@/lib/auth/auth.client";

export default function AuthMethods({ onEmailSignIn = () => {} }: { onEmailSignIn: VoidFunction }) {
    return (
        <div className="p-4 method-selection space-y-4">
            <Button
                onPress={() =>
                    authClient.signIn.social({
                        provider: "google",
                        callbackURL: "/",
                    })
                }
                className={"w-full"}
                intent="secondary"
            >
                <IconBrandGoogle className="!size-5 -translate-y-0.5" />
                Continue with Google
            </Button>
            <Button className="w-full" onPress={() => onEmailSignIn()}>
                Continue with Email
            </Button>
        </div>
    );
}
