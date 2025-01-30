"use client";
import React, { useState, useEffect } from "react";
import { Button, Heading, Modal } from "@/components/ui";
import { Package } from "@prisma/client";
import Image from "next/image";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";

const wallet = {
    names: "Thierry",
    momoCode: "687702",
    whatsappSupport: "+250788451370",
};

export default function BuyButton({ pkg }: { pkg: Package }) {
    const [buyModalOpened, setBuyModalOpen] = useState(false);
    const [countdown, setCountdown] = useState(10);
    const [canClickDone, setCanClickDone] = useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (buyModalOpened && countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        }
        if (countdown === 0) {
            setCanClickDone(true);
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [buyModalOpened, countdown]);

    const resetCountdown = () => {
        setCountdown(10);
        setCanClickDone(false);
    };

    const openCaller = () => {
        if (typeof window !== "undefined") {
            window.open(`tel:*182*8*1*${wallet.momoCode}#`);
        }
    };
    return (
        <>
            <Button onPress={() => setBuyModalOpen(true)} shape="circle" className="w-full">
                Buy
            </Button>
            <Modal
                isOpen={buyModalOpened}
                onOpenChange={(open) => {
                    setBuyModalOpen(open);
                    if (!open) resetCountdown();
                }}
            >
                <Modal.Content>
                    <Modal.Header>
                        <Modal.Title>
                            {pkg.name} &nbsp;
                            {formatCurrency(pkg.price)}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="flex flex-col space-y-4">
                            <Heading>Scan this QR to purchase the package</Heading>
                            <div className="aspect-square w-full p-2 bg-white rounded-md overflow-hidden shadow-md">
                                <Image
                                    className="w-full"
                                    alt="MTN QR Code"
                                    src="/images/mtn-payment-qr-code.png"
                                    width={220}
                                    height={220}
                                />
                            </div>
                            <div className="text-center text-sm text-gray-500">or</div>
                            <Button onPress={openCaller} className="w-full">
                                Click to Pay
                            </Button>
                            <p className="text-base font-semibold">Manual way to pay with MTN</p>
                            <ul className="text-base text-muted-fg space-y-2">
                                <li>
                                    Dial{" "}
                                    <b
                                        onClick={openCaller}
                                        className="underline underline-offset-4"
                                    >
                                        *182*8*1*{wallet.momoCode}#
                                    </b>
                                </li>
                                <li>
                                    Enter amount: <b>{pkg.price}</b>
                                </li>
                                <li>
                                    Verify recipient's name: <b>{wallet.names}</b>
                                </li>
                                <li>
                                    Enter <b>PIN</b> to confirm
                                </li>
                            </ul>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            onPress={() => {
                                const currentDate = new Date().toLocaleDateString();
                                const whatsappLink = `https://wa.me/${wallet.whatsappSupport}?text=Hello, I just purchased the ${pkg.name} package on ${currentDate}.`;
                                window.open(whatsappLink, "_blank");
                                toast.error(
                                    "Please wait while we verify your payment. You will be notified via the email used during registration.",
                                    {
                                        duration: 10000,
                                    },
                                );
                            }}
                            intent="secondary"
                            isDisabled={!canClickDone}
                        >
                            Done? {countdown > 0 ? `(${countdown}s)` : ""}
                        </Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </>
    );
}
