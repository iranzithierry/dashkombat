"use client";

import { useEffect } from "react";
import { useClickStore } from "../click-store";

export const VideoAd = () => {
    const { showAd: isVisible, setShowAd: onClose } = useClickStore();
    useEffect(() => {
        if (isVisible) {
            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (err) {
                console.error("Ad Error:", err);
            }
        }
    }, [isVisible]);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg">
                <ins
                    className="adsbygoogle"
                    style={{ display: "block" }}
                    data-ad-client="your-client-id"
                    data-ad-slot="your-ad-slot"
                    data-ad-format="video"
                    data-full-width-responsive="true"
                ></ins>
            </div>
        </div>
    );
};
