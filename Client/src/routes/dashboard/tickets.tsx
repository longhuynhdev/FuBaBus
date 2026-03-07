import { createFileRoute } from "@tanstack/react-router";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { TicketTable } from "@/components/dashboard/ticket-table";

export const Route = createFileRoute("/dashboard/tickets")({
	component: DashboardTickets,
});

function DashboardTickets() {
	return (
		<>
			<DashboardHeader title="Vé xe" />
			<div className="p-4">
				<TicketTable />
			</div>
		</>
	);
}
