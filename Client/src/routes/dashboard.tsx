import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

export const Route = createFileRoute("/dashboard")({
	beforeLoad: () => {
		const role = localStorage.getItem("role");
		if (role !== "EMPLOYEE" && role !== "ADMIN") {
			throw redirect({ to: "/login" });
		}
	},
	component: DashboardLayout,
});

function DashboardLayout() {
	return (
		<SidebarProvider>
			<DashboardSidebar />
			<SidebarInset>
				<Outlet />
			</SidebarInset>
		</SidebarProvider>
	);
}
