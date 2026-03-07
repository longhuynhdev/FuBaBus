import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/header";
import { TicketLookup } from "@/components/lookup/ticket-lookup";

export const Route = createFileRoute("/lookup-ticket")({
	component: LookupTicketPage,
});

function LookupTicketPage() {
	return (
		<div className="min-h-screen">
			<Header />
			<main className="max-w-[1128px] mx-auto px-4 mt-6 relative">
				<div className="p-8 bg-white border border-gray-200 rounded-2xl">
					<TicketLookup />
				</div>
			</main>
		</div>
	);
}
