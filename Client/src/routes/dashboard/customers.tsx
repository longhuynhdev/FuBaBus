import { createFileRoute } from "@tanstack/react-router";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { CustomerTable } from "@/components/dashboard/customer-table";

export const Route = createFileRoute("/dashboard/customers")({
	component: DashboardCustomers,
});

function DashboardCustomers() {
	return (
		<>
			<DashboardHeader title="Khách hàng" />
			<div className="p-4">
				<CustomerTable />
			</div>
		</>
	);
}
