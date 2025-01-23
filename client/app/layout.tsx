import "@/styles/globals.css";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { displayFont } from "@/lib/utils/fonts";
import { Providers } from "@/components/providers";
import { siteConfig } from "@/resources/site";

export const metadata: Metadata = {
    title: {
        template: `%s / ${siteConfig.name}`,
        default: `${siteConfig.name}`,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={cn("font-display antialiased", displayFont.variable)}>
                <Toaster richColors position="top-right" />
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
