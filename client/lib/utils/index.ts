import { type ClassValue, clsx } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

async function delay(ms: number) {
    return await new Promise((resolve) => setTimeout(resolve, ms));
}

const formatCurrency = (amount: number) => {
    return amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        currency: "RWF",
        style: "currency",
        currencyDisplay: "narrowSymbol",
    });
};

const didPackageExpired = (purchasedPackageAt: Date, packageDurationDays: number) => {
    const daysSincePurchase = Math.floor(
        (new Date().getTime() - purchasedPackageAt.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (daysSincePurchase > packageDurationDays) {
        return true;
    }
    return false
};
export { cn, delay, formatCurrency, didPackageExpired };
export * from "./fonts";
