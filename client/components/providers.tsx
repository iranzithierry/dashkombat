"use client";

import { useRouter } from "next/navigation";
import { RouterProvider } from "react-aria-components";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

declare module "react-aria-components" {
    interface RouterConfig {
        routerOptions: NonNullable<Parameters<ReturnType<typeof useRouter>["push"]>[1]>;
    }
}

export function Providers({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const queryClient = new QueryClient();
    return (
        <RouterProvider navigate={router.push}>
            <NextThemesProvider
                themes={["dark"]}
                forcedTheme="dark"
                defaultTheme="dark"
                enableColorScheme={false}
                enableSystem={false}
                attribute="class"
            >
                <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
            </NextThemesProvider>
        </RouterProvider>
    );
}
