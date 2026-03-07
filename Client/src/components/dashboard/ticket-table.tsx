import { useEffect, useState } from "react";
import { DataTable } from "@/components/dashboard/data-table";
import { apiFetch } from "@/lib/api";
import { formatVND } from "@/lib/utils";
import { toast } from "sonner";

interface Ticket {
	id: string;
	busId: string;
	customerId: string;
	seats: string[];
	totalFare: number;
	boardingPoint: string;
	droppingPoint: string;
}

export function TicketTable() {
	const [tickets, setTickets] = useState<Ticket[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		apiFetch("/api/tickets")
			.then((res) => (res.ok ? res.json() : []))
			.then(setTickets)
			.catch(() => toast.error("Không thể tải danh sách vé"))
			.finally(() => setLoading(false));
	}, []);

	const columns = [
		{ header: "Mã vé", accessorKey: "id" as const },
		{ header: "Mã xe", accessorKey: "busId" as const },
		{ header: "Mã KH", accessorKey: "customerId" as const },
		{
			header: "Ghế",
			cell: (row: Ticket) => row.seats?.join(", ") ?? "",
		},
		{
			header: "Tổng tiền",
			cell: (row: Ticket) => formatVND(row.totalFare),
		},
		{ header: "Điểm đón", accessorKey: "boardingPoint" as const },
		{ header: "Điểm trả", accessorKey: "droppingPoint" as const },
	];

	return <DataTable columns={columns} data={tickets} isLoading={loading} />;
}
