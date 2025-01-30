import AuthNavbar from "./components/auth-navbar"

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<main className="h-dvh justify-center items-center flex relative flex-1">
			<div className="fixed right-0 left-0 top-0">
				<AuthNavbar />
			</div>
			<div className="absolute right-0 bottom-0 h-120 w-200 rounded-xl bg-gradient-to-br from-sky-500 to-blue-500 opacity-5 blur-3xl" />
			<div className="mx-auto px-2 w-full max-w-lg">
				{children}
			</div>
		</main>
	)
}
