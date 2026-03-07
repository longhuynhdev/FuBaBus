import { createFileRoute } from "@tanstack/react-router";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { BusTable } from "@/components/dashboard/bus-table";

export const Route = createFileRoute("/dashboard/buses")({
	component: DashboardBuses,
});

function DashboardBuses() {
	return (
		<>
			<DashboardHeader title="Quản lý xe" />
			<div className="p-4">
				<BusTable />
			</div>
		</>
	);
}
