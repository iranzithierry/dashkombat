import { cn } from "@/lib/utils";

export function Container({ children, className }: { children: React.ReactNode, className?: string }) {
	return <div className={cn(className, "flex-1 max-w-7xl p-4 sm:p-6")}>{children}</div>
}
