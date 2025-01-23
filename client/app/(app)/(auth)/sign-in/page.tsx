import type { Metadata } from "next"
import { Card } from "@/components/ui"
import SignInForm from "../components/sign-in-form"

export const metadata: Metadata = {
	title: "Sign In",
}

export default function Page() {
	return (
		<Card className="relative inset-shadow-fg/5 inset-shadow-xs border-0 ring ring-fg/10 dark:inset-ring-fg/5">
			<SignInForm />
		</Card>
	)
}
