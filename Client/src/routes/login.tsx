import { createFileRoute } from "@tanstack/react-router";
import { LoginForm } from "@/components/auth/login-form";
import { Header } from "@/components/layout/header";

export const Route = createFileRoute("/login")({
	component: LoginPage,
});

function LoginPage() {
	return (
		<div className="min-h-screen">
			<Header />
			<main className="relative px-4">
				<div className="relative -mt-20">
					<LoginForm />
				</div>
			</main>
		</div>
	);
}
