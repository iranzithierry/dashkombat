"use client";

import { useEffect } from "react";
import { useClickStore } from "../click-store";
import { siteConfig } from "@/resources/site";

export const VideoAd = () => {
    const { showAd } = useClickStore();
    useEffect(() => {
        if (showAd) {
            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (err) {
                console.error("Ad Error:", err);
            }
        }
    }, [showAd]);

    if (!showAd) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg">
                <ins
                    className="adsbygoogle"
                    style={{ display: "block" }}
                    data-ad-client={siteConfig.google.adClientId}
                    data-ad-slot={siteConfig.google.adSlot}
                    data-ad-format="video"
                    data-adtest={process.env.NODE_ENV === "development" ? "on" : "off"}
                    data-full-width-responsive="true"
                ></ins>
            </div>
        </div>
    );
};
