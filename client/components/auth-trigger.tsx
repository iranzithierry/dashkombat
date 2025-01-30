"use client";
import { cn } from "@/lib/utils";
import { Button, Modal } from "ui";
import React, { useState } from "react";
import SignInForm from "@/app/(app)/(auth)/components/sign-in-form";
import SignUpForm from "@/app/(app)/(auth)/components/sign-up-form";

export default function AuthTrigger() {
    const [isSignUp, setIsSignUp] = useState(false);

    return (
        <Modal>
            <Button size="small" className={"px-6"} shape="circle">
                Sign In
            </Button>
            <Modal.Content size="xl">
                {isSignUp ? (
                    <Modal.Header>
                        <Modal.Title className="flex justify-center">
                            Create your account
                        </Modal.Title>
                        <Modal.Description className="text-center">
                            Please fill in the details to get started.
                        </Modal.Description>
                    </Modal.Header>
                ) : (
                    <Modal.Header />
                )}

                <Modal.Body>
                    <div
                        className={cn(
                            !isSignUp && "[&>.yahnba]:!p-0",
                            "[&_.method-selection]:!p-0",
                            "flex-1 flex-col h-full",
                        )}
                    >
                        {isSignUp ? <SignUpForm /> : <SignInForm />}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="flex flex-col items-center">
                        <div className="flex gap-x-3">
                            {isSignUp ? "Already have an account? " : "Don't have an account?"}
                            <button
                                className="font-semibold underline cursor-pointer hover:text-muted-fg"
                                onClick={() => setIsSignUp(isSignUp ? false : true)}
                            >
                                {isSignUp ? "Sign In" : "Sign Up"}
                            </button>
                        </div>
                        <div className="flex font-semibold text-muted-fg mt-4">
                            <p>
                                By signing up, you agree to our{" "}
                                <b className="text-fg underline underline-offset-2">
                                    <a href="/terms">Terms</a>
                                </b>
                                &nbsp;and&nbsp;
                                <b className="text-fg underline underline-offset-2">
                                    <a href="/privacy">Privacy Policy</a>
                                </b>
                            </p>
                        </div>
                    </div>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    );
}
