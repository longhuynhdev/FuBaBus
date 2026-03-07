import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/header";
import { InvoiceLookup } from "@/components/lookup/invoice-lookup";

export const Route = createFileRoute("/invoice")({
	component: InvoicePage,
});

function InvoicePage() {
	return (
		<div className="min-h-screen">
			<Header />
			<main className="max-w-[1128px] mx-auto px-4 mt-6 relative">
				<div className="p-8 bg-white border border-gray-200 rounded-2xl">
					<InvoiceLookup />
				</div>
			</main>
		</div>
	);
}
