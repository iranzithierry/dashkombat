"use client";
import React, { useState } from "react";
import { Button, Heading, Modal } from "@/components/ui";
import { Package } from "@prisma/client";
import Image from "next/image";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";

const wallet = {
    names: "Thierry",
    momoCode: "687702",
};

export default function BuyButton({ pkg }: { pkg: Package }) {
    const [buyModalOpened, setBuyModalOpen] = useState(false);

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
            <Modal isOpen={buyModalOpened} onOpenChange={setBuyModalOpen}>
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
                                toast.error(
                                    "Please wait while we verify your payment. You will be notified via the email used during registration.",
                                    {
                                        duration: 10000,
                                    },
                                );
                            }}
                            intent="secondary"
                        >
                            Done?
                        </Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </>
    );
}
