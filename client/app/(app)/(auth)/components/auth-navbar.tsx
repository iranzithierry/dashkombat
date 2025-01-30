"use client";
import { Button, Navbar } from "ui";
import { siteConfig } from "@/resources/site";
import { usePathname, useRouter } from "next/navigation";

export default function AuthNavbar(props: React.ComponentProps<typeof Navbar>) {
    const router = useRouter();
    const pathname = usePathname();
    const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
    const redirectBackParam = params.get("redirect-back") || "/";
    return (
        <Navbar {...props}>
            <div className="flex w-full justify-between backdrop-blur-md border-b-2 border-muted items-center p-2">
                <a href="/" className="flex gap-x-3">
                    <h4 className="font-medium text-base !pl-0 flex items-center">
                        {siteConfig.name}
                    </h4>
                </a>
                <Button
                    onPress={() => {
                        router.push(
                            pathname == "/sign-up"
                                ? `/sign-in?redirect-back=${redirectBackParam}`
                                : `/sign-up?redirect-back=${redirectBackParam}`,
                        );
                    }}
                    intent="secondary"
                    size="small"
                >
                    {pathname == "/sign-up" ? "Login" : "Sign up"}
                </Button>
            </div>
        </Navbar>
    );
}
