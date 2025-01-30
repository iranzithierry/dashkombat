import { Navigation } from "@/components/navigation";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="min-h-dvh pb-[5rem] flex-col flex">
            <div className="absolute -z-10 right-0 bottom-0 h-120 w-200 rounded-xl bg-gradient-to-br from-sky-500 to-blue-500 opacity-5 blur-3xl" />
            {children}
            <Navigation />
        </main>
    );
}
