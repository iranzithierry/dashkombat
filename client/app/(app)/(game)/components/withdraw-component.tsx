"use client";

import { z } from "zod";
import React from "react";
import { toast } from "sonner";
import { siteConfig } from "@/resources/site";
import { Modal } from "@/components/ui/modal";
import { formatCurrency } from "@/lib/utils";
import { withdrawPoints } from "../actions/withdraw";
import { useForm } from "@/lib/utils/hooks/use-form";
import { Card, Button, TextField, Select, ValidatorForm, Note } from "ui";
import { PAYMENT_PROVIDERS, type PaymentProvider } from "@/resources/constants";

const formSchemaSchema = z.object({
    points: z
        .number()
        .min(
            siteConfig.minimumPoints,
            `Points must be greater than or equal to ${siteConfig.minimumPoints}`,
        ),
    phoneNumber: z.string().min(9, "Phone number is invalid").max(12, "Phone number is invalid"),
    paymentProvider: z.enum(
        // @ts-ignore
        PAYMENT_PROVIDERS.map((p) => p.id),
        { message: "Invalid payment method selected" },
    ),
});
export default function WithdrawComponent() {
    const [message, setMessage] = React.useState("");
    const { inputValues, inputErrors, handleChange, handleSubmit, isLoading } = useForm({
        schema: formSchemaSchema,
        initialValues: { points: siteConfig.minimumPoints, phoneNumber: "", paymentProvider: "" },
    });
    const onSubmit = async (data: typeof inputValues) => {
        const result = await withdrawPoints({
            points: Number(data.points),
            phoneNumber: data.phoneNumber,
            paymentProvider: data.paymentProvider as PaymentProvider,
        });
        if (result.error) {
            toast.error(result.error, { duration: 5000 });
            return;
        }
        const amount = Number(data.points) / siteConfig.pointsDivider;
        setMessage(
            `Your withdrawal request of <b style="color: white;">${formatCurrency(amount)} (${data.points.toLocaleString()} points)</b> has been received.<br/> Once verified, the amount will be sent to <b style="color: white;">${data.phoneNumber}</b>. This process typically takes 24-48 hours.`,
        );
        toast.success(
            `Your withdrawal request has been received. Once verified, the amount will be sent to ${data.phoneNumber}. This process typically takes 24-48 hours.`,
            { duration: 8000 },
        );
    };

    return (
        <Card className="bg-muted">
            <Card.Header>
                <Card.Title>Withdraw</Card.Title>
            </Card.Header>
            <Card.Content className="space-y-4">
                <Modal>
                    <Button intent="warning" className="w-full font-semibold">
                        Withdraw
                    </Button>
                    <Modal.Content>
                        <Modal.Header>
                            <Modal.Title>Withdraw Points</Modal.Title>
                            <Modal.Description>
                                Convert your points to money. Minimum withdrawal is 1000 points.
                            </Modal.Description>
                        </Modal.Header>
                        <ValidatorForm
                            validationErrors={inputErrors}
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <Modal.Body className="space-y-4">
                                {/* {JSON.stringify(inputErrors)} */}
                                <div className="space-y-4 pt-1">
                                    {message ? <Note intent="success"><p dangerouslySetInnerHTML={{ __html: message}}/></Note> : null}
                                    <TextField
                                        type="number"
                                        placeholder="Enter points to withdraw"
                                        value={inputValues.points.toString()}
                                        errorMessage={inputErrors.points}
                                        onChange={(v) => handleChange("points", parseInt(v))}
                                    />
                                    <Select
                                        placeholder="Select payment provider"
                                        defaultSelectedKey={inputValues.paymentProvider}
                                        errorMessage={inputErrors.paymentProvider}
                                        onSelectionChange={(value) =>
                                            handleChange("paymentProvider", value)
                                        }
                                    >
                                        <Select.Trigger />
                                        <Select.List items={PAYMENT_PROVIDERS}>
                                            {(provider) => (
                                                <Select.Option
                                                    id={provider.id}
                                                    textValue={provider.name as string}
                                                >
                                                    {provider.name}
                                                </Select.Option>
                                            )}
                                        </Select.List>
                                    </Select>
                                    <TextField
                                        type="tel"
                                        placeholder="Enter phone number (e.g., 07xxxxxxxx)"
                                        value={inputValues.phoneNumber}
                                        errorMessage={inputErrors.phoneNumber}
                                        onChange={(v) => handleChange("phoneNumber", v)}
                                    />
                                    {inputValues.points ? (
                                        <p className="text-sm text-muted-foreground">
                                            You will receive:{" "}
                                            {formatCurrency(
                                                Number(inputValues.points) /
                                                    siteConfig.pointsDivider,
                                            )}
                                        </p>
                                    ) : null}
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Modal.Close>Cancel</Modal.Close>
                                <Button type="submit" intent="warning" isPending={isLoading}>
                                    Confirm Withdrawal
                                </Button>
                            </Modal.Footer>
                        </ValidatorForm>
                    </Modal.Content>
                </Modal>
            </Card.Content>
        </Card>
    );
}
