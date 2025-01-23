import { type ClassValue, clsx } from "clsx";
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

export { cn, delay, formatCurrency };
export * from "./fonts";
