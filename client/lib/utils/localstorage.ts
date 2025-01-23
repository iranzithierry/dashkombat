export class LocalStorageClient {
    public remainingClicksItem: string;

    constructor() {
        this.remainingClicksItem = "remaining.clicks";
    }
    public setItem(key: string, value: any) {
        if (typeof window !== "undefined") {
            window.localStorage.setItem(key, value);
        }
    }

    public getItem(key: string) {
        if (typeof window !== "undefined") {
            return window.localStorage.getItem(key);
        }
    }

    public removeItem(key: string) {
        if (typeof window !== "undefined") {
            window.localStorage.removeItem(key);
        }
    }
}