import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/header";
import { PaymentForm } from "@/components/payment/payment-form";

export const Route = createFileRoute("/payment")({
	component: PaymentPage,
});

function PaymentPage() {
	return (
		<div className="min-h-screen bg-gray-50">
			<Header />
			<main className="max-w-[1200px] mx-auto px-4 py-8">
				<PaymentForm />
			</main>
		</div>
	);
}
