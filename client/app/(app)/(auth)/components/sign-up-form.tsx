"use client";
import { z } from "zod";
import { useState } from "react";
import AuthMethods from "./auth-methods";
import { ArrowLeft } from "lucide-react";
import { authClient } from "@/lib/auth/auth.client";
import { useForm } from "@/lib/utils/hooks/use-form";
import { ValidatorForm } from "@/components/ui/form";
import { Button, ProgressCircle, TextField } from "ui";
import { motion, AnimatePresence } from "framer-motion";

type Step = "name" | "method" | "final";

const signUpSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export default function SignUpForm() {
    const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
    const redirectBackParam = params.get("redirect-back") || "/";

    const formValues = { email: "", name: "", password: "" };
    const [currentStep, setCurrentStep] = useState<Step>("name");
    const { inputValues, inputErrors, handleChange, setError, handleSubmit, isLoading } = useForm({
        schema: signUpSchema,
        initialValues: formValues,
        customValidate(values) {
            const errors: Partial<Record<keyof typeof formValues, string>> = {};
            if (currentStep === "name") {
                const result = signUpSchema.pick({ name: true }).safeParse(values);
                if (!result.success) {
                    const fieldErrors = result.error.flatten().fieldErrors;
                    if (fieldErrors.name) {
                        errors.name = fieldErrors.name[0];
                    }
                }
            }

            if (currentStep === "final") {
                const result = signUpSchema.pick({ email: true, password: true }).safeParse(values);
                if (!result.success) {
                    const fieldErrors = result.error.flatten().fieldErrors;
                    if (fieldErrors.email) {
                        errors.email = fieldErrors.email[0];
                    }
                    if (fieldErrors.password) {
                        errors.password = fieldErrors.password[0];
                    }
                }
            }
            return errors;
        },
    });

    const onSubmit = async (data: typeof formValues) => {
        if (currentStep === "name") {
            setCurrentStep("method");
            return;
        }
        if (currentStep === "final") {
            await authClient.signUp
                .email(
                    {
                        name: data.name,
                        email: data.email,
                        password: data.password,
                        callbackURL: "/",
                    },
                    {
                        onError: (ctx) => {
                            const errorMessage = ctx.error.message;
                            console.error(errorMessage);
                            errorMessage.toLocaleLowerCase().split(" ").includes("password")
                                ? setError("password", errorMessage)
                                : setError("email", errorMessage);
                        },
                        onSuccess: () => {
                            typeof window !== "undefined" &&
                                window.location.replace(redirectBackParam);
                        },
                    },
                )
                .catch((e) => e);
        }
    };

    const variants = {
        enter: { x: 20, opacity: 0 },
        center: { x: 0, opacity: 1 },
        exit: { x: -20, opacity: 0 },
    };
    return (
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
                        {currentStep === "name" && (
                            <TextField
                                name="name"
                                isRequired
                                label="Name"
                                errorMessage={inputErrors.name}
                                value={inputValues.name}
                                placeholder="Enter your name"
                                onChange={(v) => handleChange("name", v)}
                            />
                        )}

                        {currentStep === "method" && (
                            <AuthMethods onEmailSignIn={() => setCurrentStep("final")} />
                        )}

                        {currentStep === "final" && (
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
                                            ? currentStep == "final"
                                                ? "Signing up..."
                                                : "Continuing..."
                                            : currentStep == "final"
                                              ? "Sign up"
                                              : "Continue"}
                                    </>
                                )}
                            </Button>
                        )}
                        {currentStep === "final" && (
                            <button
                                type="button"
                                onClick={() => setCurrentStep("method")}
                                className="text-sm cursor-pointer text-primary flex items-center"
                            >
                                <ArrowLeft className="w-4 h-4 mr-1" /> Other Sign Up options
                            </button>
                        )}
                    </ValidatorForm>
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
}
