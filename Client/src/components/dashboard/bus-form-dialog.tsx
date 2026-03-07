import { type FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

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
}

interface BusFormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	bus: Bus | null;
	onSuccess: () => void;
}

interface FormData {
	departureTime: string;
	departureLocation: string;
	arrivalTime: string;
	arrivalLocation: string;
	fare: string;
	boardingPoints: string;
	droppingPoints: string;
	busType: string;
}

function formatDateTimeForInput(isoString: string): string {
	if (!isoString) return "";
	const d = new Date(isoString);
	const pad = (n: number) => String(n).padStart(2, "0");
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatDateTimeForApi(datetimeLocal: string): string {
	// Convert "2025-01-15T08:30" to "2025-01-15:08:30"
	return datetimeLocal.replace("T", ":");
}

export function BusFormDialog({
	open,
	onOpenChange,
	bus,
	onSuccess,
}: BusFormDialogProps) {
	const isEditing = !!bus;

	const [formData, setFormData] = useState<FormData>({
		departureTime: "",
		departureLocation: "",
		arrivalTime: "",
		arrivalLocation: "",
		fare: "",
		boardingPoints: "",
		droppingPoints: "",
		busType: "GHẾ",
	});

	useEffect(() => {
		if (bus) {
			setFormData({
				departureTime: formatDateTimeForInput(bus.departureTime),
				departureLocation: bus.departureLocation,
				arrivalTime: formatDateTimeForInput(bus.arrivalTime),
				arrivalLocation: bus.arrivalLocation,
				fare: String(bus.fare),
				boardingPoints: bus.boardingPoints?.join(", ") ?? "",
				droppingPoints: bus.droppingPoints?.join(", ") ?? "",
				busType: bus.busType,
			});
		} else {
			setFormData({
				departureTime: "",
				departureLocation: "",
				arrivalTime: "",
				arrivalLocation: "",
				fare: "",
				boardingPoints: "",
				droppingPoints: "",
				busType: "GHẾ",
			});
		}
	}, [bus, open]);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		const body = {
			departureTime: formatDateTimeForApi(formData.departureTime),
			departureLocation: formData.departureLocation,
			arrivalTime: formatDateTimeForApi(formData.arrivalTime),
			arrivalLocation: formData.arrivalLocation,
			fare: Number(formData.fare),
			boardingPoints: formData.boardingPoints
				.split(",")
				.map((s) => s.trim())
				.filter(Boolean),
			droppingPoints: formData.droppingPoints
				.split(",")
				.map((s) => s.trim())
				.filter(Boolean),
			busType: formData.busType,
		};

		try {
			const url = isEditing ? `/api/buses/${bus.id}` : "/api/buses";
			const method = isEditing ? "PUT" : "POST";
			const res = await apiFetch(url, {
				method,
				body: JSON.stringify(body),
			});
			if (res.ok) {
				toast.success(isEditing ? "Cập nhật thành công" : "Tạo xe thành công");
				onOpenChange(false);
				onSuccess();
			} else {
				toast.error("Thao tác thất bại");
			}
		} catch {
			toast.error("Có lỗi xảy ra");
		}
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle>
						{isEditing ? "Chỉnh sửa xe" : "Thêm xe mới"}
					</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="grid gap-4">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<label className="grid gap-1.5">
							<span className="text-sm font-medium">Nơi đi</span>
							<Input
								name="departureLocation"
								value={formData.departureLocation}
								onChange={handleChange}
								required
							/>
						</label>
						<label className="grid gap-1.5">
							<span className="text-sm font-medium">Nơi đến</span>
							<Input
								name="arrivalLocation"
								value={formData.arrivalLocation}
								onChange={handleChange}
								required
							/>
						</label>
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<label className="grid gap-1.5">
							<span className="text-sm font-medium">Giờ đi</span>
							<Input
								type="datetime-local"
								name="departureTime"
								value={formData.departureTime}
								onChange={handleChange}
								required
							/>
						</label>
						<label className="grid gap-1.5">
							<span className="text-sm font-medium">Giờ đến</span>
							<Input
								type="datetime-local"
								name="arrivalTime"
								value={formData.arrivalTime}
								onChange={handleChange}
								required
							/>
						</label>
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<label className="grid gap-1.5">
							<span className="text-sm font-medium">Giá vé (VND)</span>
							<Input
								type="number"
								name="fare"
								value={formData.fare}
								onChange={handleChange}
								required
							/>
						</label>
						<label className="grid gap-1.5">
							<span className="text-sm font-medium">Loại xe</span>
							<select
								name="busType"
								value={formData.busType}
								onChange={handleChange}
								className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
							>
								<option value="GHẾ">Ghế</option>
								<option value="GIƯỜNG">Giường</option>
								<option value="LIMOUSINE">Limousine</option>
							</select>
						</label>
					</div>
					<label className="grid gap-1.5">
						<span className="text-sm font-medium">
							Điểm đón (cách nhau bởi dấu phẩy)
						</span>
						<Input
							name="boardingPoints"
							value={formData.boardingPoints}
							onChange={handleChange}
							placeholder="Bến xe A, Bến xe B"
						/>
					</label>
					<label className="grid gap-1.5">
						<span className="text-sm font-medium">
							Điểm trả (cách nhau bởi dấu phẩy)
						</span>
						<Input
							name="droppingPoints"
							value={formData.droppingPoints}
							onChange={handleChange}
							placeholder="Bến xe C, Bến xe D"
						/>
					</label>
					<Button
						type="submit"
						className="bg-orange-600 hover:bg-orange-600/80 text-white"
					>
						{isEditing ? "Cập nhật" : "Tạo mới"}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
