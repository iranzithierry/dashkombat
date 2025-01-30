import type { Metadata } from "next";
import { Card } from "@/components/ui";
import SignUpForm from "../components/sign-up-form";

export const metadata: Metadata = {
    title: "Sign Up",
};

export default async function Page() {
    return (
        <Card className="relative inset-shadow-fg/5 inset-shadow-xs border-0 ring ring-fg/10 dark:inset-ring-fg/5">
            <Card.Header className="w-full text-center !py-8">
                <Card.Title className="!text-2xl">Create your account</Card.Title>
                <Card.Description>Please fill in the details to get started.</Card.Description>
            </Card.Header>
            <Card.Content className="!bg-transparent !border-0">
                <SignUpForm />
            </Card.Content>
        </Card>
    );
}
