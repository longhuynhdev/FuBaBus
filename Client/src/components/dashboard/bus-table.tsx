import { Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BusFormDialog } from "@/components/dashboard/bus-form-dialog";
import { DataTable } from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { formatVND, getStatusLabel, getStatusVariant } from "@/lib/utils";

interface Bus {
	id: string;
	departureTime: string;
	departureLocation: string;
	arrivalTime: string;
	arrivalLocation: string;
	fare: number;
	boardingPoints: string[];
	droppingPoints: string[];
	busType: string;
	status: string;
	seats: { seatNumber: string; isBooked: boolean }[];
}

function formatDateTime(iso: string): string {
	const d = new Date(iso);
	return d.toLocaleString("vi-VN", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

const PAGE_SIZE = 20;

export function BusTable() {
	const [buses, setBuses] = useState<Bus[]>([]);
	const [loading, setLoading] = useState(true);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingBus, setEditingBus] = useState<Bus | null>(null);
	const [page, setPage] = useState(0);
	const [totalPages, setTotalPages] = useState(0);
	const [totalElements, setTotalElements] = useState(0);

	const fetchBuses = async (targetPage = page) => {
		setLoading(true);
		try {
			const res = await apiFetch(
				`/api/buses?page=${targetPage}&size=${PAGE_SIZE}`,
			);
			if (res.ok) {
				const data = await res.json();
				if (Array.isArray(data)) {
					setBuses(data);
					setTotalPages(1);
					setTotalElements(data.length);
				} else {
					setBuses(data.content ?? []);
					setTotalPages(data.totalPages ?? 0);
					setTotalElements(data.totalElements ?? 0);
				}
				setPage(targetPage);
			}
		} catch {
			toast.error("Không thể tải danh sách xe");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchBuses(0);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleDelete = async (id: string) => {
		if (!confirm("Bạn có chắc muốn xoá xe này?")) return;
		try {
			const res = await apiFetch(`/api/buses/${id}`, { method: "DELETE" });
			if (res.ok) {
				toast.success("Đã xoá xe");
				fetchBuses();
			} else {
				toast.error("Xoá thất bại");
			}
		} catch {
			toast.error("Có lỗi xảy ra");
		}
	};

	const handleEdit = (bus: Bus) => {
		setEditingBus(bus);
		setDialogOpen(true);
	};

	const handleCreate = () => {
		setEditingBus(null);
		setDialogOpen(true);
	};

	const columns = [
		{
			header: "Tuyến",
			cell: (row: Bus) => `${row.departureLocation} → ${row.arrivalLocation}`,
		},
		{
			header: "Giờ đi",
			cell: (row: Bus) => formatDateTime(row.departureTime),
		},
		{
			header: "Giờ đến",
			cell: (row: Bus) => formatDateTime(row.arrivalTime),
		},
		{
			header: "Loại xe",
			cell: (row: Bus) => <Badge variant="outline">{row.busType}</Badge>,
		},
		{
			header: "Giá vé",
			cell: (row: Bus) => formatVND(row.fare),
		},
		{
			header: "Trạng thái",
			cell: (row: Bus) => (
				<Badge variant={getStatusVariant(row.status)}>
					{getStatusLabel(row.status)}
				</Badge>
			),
		},
		{
			header: "Ghế trống",
			cell: (row: Bus) => {
				const available = row.seats?.filter((s) => !s.isBooked).length ?? 0;
				const total = row.seats?.length ?? 0;
				return `${available}/${total}`;
			},
		},
		{
			header: "Thao tác",
			cell: (row: Bus) => (
				<div className="flex gap-1">
					<Button variant="ghost" size="icon" onClick={() => handleEdit(row)}>
						<Pencil className="h-4 w-4" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						onClick={() => handleDelete(row.id)}
					>
						<Trash2 className="h-4 w-4 text-destructive" />
					</Button>
				</div>
			),
		},
	];

	return (
		<div className="space-y-4">
			<div className="flex justify-end">
				<Button
					onClick={handleCreate}
					className="bg-orange-600 hover:bg-orange-600/80 text-white"
				>
					<Plus className="mr-2 h-4 w-4" />
					Thêm xe
				</Button>
			</div>
			<DataTable
				columns={columns}
				data={buses}
				isLoading={loading}
				pagination={{
					page,
					totalPages,
					totalElements,
					onPageChange: fetchBuses,
				}}
			/>
			<BusFormDialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				bus={editingBus}
				onSuccess={fetchBuses}
			/>
		</div>
	);
}
