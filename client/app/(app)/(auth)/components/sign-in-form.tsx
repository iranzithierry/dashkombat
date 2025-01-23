"use client";

import { z } from "zod";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import AuthMethods from "./auth-methods";
import { siteConfig } from "@/resources/site";
import { authClient } from "@/lib/auth/auth.client";
import { useForm } from "@/lib/utils/hooks/use-form";
import { ValidatorForm } from "@/components/ui/form";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Card, ProgressCircle, TextField } from "ui";

type Step = "method" | "email";

const signInSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export default function SignInForm() {
    const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
    const redirectBackParam = params.get("redirect-back") || "/";
    const [currentStep, setCurrentStep] = useState<Step>("method");
    const { inputValues, inputErrors, handleChange, setError, handleSubmit, isLoading } = useForm({
        schema: signInSchema,
        initialValues: { email: "", password: "" },
    });

    const onSubmit = async (data: typeof inputValues) => {
        if (currentStep === "email") {
            await authClient.signIn.email(
                {
                    email: data.email,
                    password: data.password,
                },
                {
                    onError: (ctx) => setError("email", ctx.error.message),
                    onSuccess: () => {
                        if (typeof window !== "undefined") {
                            window.location.href = redirectBackParam;
                        }
                    },
                },
            );
        }
    };

    const variants = {
        enter: { x: 20, opacity: 0 },
        center: { x: 0, opacity: 1 },
        exit: { x: -20, opacity: 0 },
    };

    return (
        <>
            <Card.Header className="w-full text-center !py-8">
                <Card.Title className="!text-2xl">{"Log in to " + siteConfig.name}</Card.Title>
                {currentStep === "email" && (
                    <Card.Description>
                        If you have an account, we have sent a code to <br />
                    </Card.Description>
                )}
            </Card.Header>
            <Card.Content className="!bg-transparent !border-0">
                <motion.div initial={false} animate={{ height: "auto" }} className="pb-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.3 }}
                        >
                            <ValidatorForm
                                validationErrors={inputErrors}
                                onSubmit={handleSubmit(onSubmit)}
                                className="space-y-6 w-full"
                            >
                                {currentStep === "method" && (
                                    <AuthMethods onEmailSignIn={() => setCurrentStep("email")} />
                                )}

                                {currentStep === "email" && (
                                    <>
                                        <TextField
                                            type="email"
                                            label="Email address"
                                            value={inputValues.email}
                                            errorMessage={inputErrors.email}
                                            isRequired
                                            placeholder="Enter your email address"
                                            onChange={(v) => handleChange("email", v)}
                                        />
                                        <TextField
                                            isRevealable
                                            type="password"
                                            label="Password"
                                            value={inputValues.password}
                                            placeholder="Create your password"
                                            errorMessage={inputErrors.password}
                                            isRequired
                                            onChange={(v) => handleChange("password", v)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setCurrentStep("method")}
                                            className="mt-4 text-sm cursor-pointer text-primary flex items-center"
                                        >
                                            <ArrowLeft className="w-4 h-4 mr-1" /> Other Login
                                            options
                                        </button>
                                    </>
                                )}

                                {currentStep !== "method" && (
                                    <Button
                                        isDisabled={isLoading}
                                        isPending={isLoading}
                                        className="w-full"
                                        type="submit"
                                    >
                                        {({ isPending }) => (
                                            <>
                                                {isPending && (
                                                    <ProgressCircle
                                                        isIndeterminate
                                                        aria-label="Creating..."
                                                    />
                                                )}
                                                {isLoading
                                                    ? currentStep == "email"
                                                        ? "Signing in..."
                                                        : "Continuing..."
                                                    : currentStep == "email"
                                                      ? "Sign in"
                                                      : "Continue"}
                                            </>
                                        )}
                                    </Button>
                                )}
                            </ValidatorForm>
                        </motion.div>
                    </AnimatePresence>
                </motion.div>
            </Card.Content>
        </>
    );
}
