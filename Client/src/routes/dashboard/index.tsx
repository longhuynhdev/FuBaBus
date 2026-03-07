import { createFileRoute } from "@tanstack/react-router";
import { Bus, DollarSign, FileText, Receipt, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { apiFetch } from "@/lib/api";
import { formatVND } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/")({
	component: DashboardOverview,
});

interface Stats {
	totalBuses: number;
	totalTickets: number;
	totalInvoices: number;
	totalCustomers: number;
	totalRevenue: number;
	busesAvailable: number;
	busesFullyBooked: number;
	busesCompleted: number;
}

function DashboardOverview() {
	const [stats, setStats] = useState<Stats | null>(null);

	useEffect(() => {
		apiFetch("/api/admin/stats")
			.then((res) => (res.ok ? res.json() : null))
			.then(setStats)
			.catch(() => {});
	}, []);

	if (!stats) {
		return (
			<>
				<DashboardHeader title="Tổng quan" />
				<div className="p-4 text-center text-muted-foreground">
					Đang tải...
				</div>
			</>
		);
	}

	return (
		<>
			<DashboardHeader title="Tổng quan" />
			<div className="p-4 space-y-6">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					<StatCard
						title="Tổng số xe"
						value={stats.totalBuses}
						icon={Bus}
					/>
					<StatCard
						title="Vé đã bán"
						value={stats.totalTickets}
						icon={FileText}
					/>
					<StatCard
						title="Hóa đơn"
						value={stats.totalInvoices}
						icon={Receipt}
					/>
					<StatCard
						title="Doanh thu"
						value={formatVND(stats.totalRevenue)}
						icon={DollarSign}
					/>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					<StatCard
						title="Xe còn chỗ"
						value={stats.busesAvailable}
						icon={Bus}
						description="STILL_AVAILABLE"
					/>
					<StatCard
						title="Xe hết chỗ"
						value={stats.busesFullyBooked}
						icon={Bus}
						description="FULLY_BOOKED"
					/>
					<StatCard
						title="Xe hoàn thành"
						value={stats.busesCompleted}
						icon={Bus}
						description="COMPLETED"
					/>
					<StatCard
						title="Khách hàng"
						value={stats.totalCustomers}
						icon={Users}
					/>
				</div>
			</div>
		</>
	);
}
