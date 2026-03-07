import { Link, useMatchRoute } from "@tanstack/react-router";
import {
	Bus,
	FileText,
	LayoutDashboard,
	Receipt,
	Users,
} from "lucide-react";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = [
	{ to: "/dashboard", label: "Tổng quan", icon: LayoutDashboard },
	{ to: "/dashboard/buses", label: "Quản lý xe", icon: Bus },
	{ to: "/dashboard/tickets", label: "Vé xe", icon: FileText },
	{ to: "/dashboard/invoices", label: "Hóa đơn", icon: Receipt },
	{ to: "/dashboard/customers", label: "Khách hàng", icon: Users },
] as const;

export function DashboardSidebar() {
	const matchRoute = useMatchRoute();

	return (
		<Sidebar>
			<SidebarHeader className="border-b px-4 py-3">
				<Link to="/" className="flex items-center gap-2">
					<Bus className="h-6 w-6 text-orange-500" />
					<span className="text-lg font-bold">FutaBus Admin</span>
				</Link>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Quản lý</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{menuItems.map((item) => {
								const isActive =
									item.to === "/dashboard"
										? matchRoute({ to: "/dashboard", fuzzy: false })
										: matchRoute({ to: item.to, fuzzy: true });
								return (
									<SidebarMenuItem key={item.to}>
										<SidebarMenuButton asChild isActive={!!isActive}>
											<Link to={item.to}>
												<item.icon className="h-4 w-4" />
												<span>{item.label}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								);
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
