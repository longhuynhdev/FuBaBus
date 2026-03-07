import { createFileRoute } from "@tanstack/react-router";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { InvoiceTable } from "@/components/dashboard/invoice-table";

export const Route = createFileRoute("/dashboard/invoices")({
	component: DashboardInvoices,
});

function DashboardInvoices() {
	return (
		<>
			<DashboardHeader title="Hóa đơn" />
			<div className="p-4">
				<InvoiceTable />
			</div>
		</>
	);
}
