import { useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";
import { SeatSelector } from "./seat-selector";

interface BusData {
	id: string;
	departureLocation: string;
	arrivalLocation: string;
	departureTime: string;
	fare: number;
	busType: string;
	boardingPoints: string[];
	droppingPoints: string[];
	seats: { seatNumber: string; isBooked: boolean }[];
}

interface BookingFormProps {
	busId: string;
}

export function BookingForm({ busId }: BookingFormProps) {
	const navigate = useNavigate();
	const [busData, setBusData] = useState<BusData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
	const [customerName, setCustomerName] = useState("");
	const [customerPhone, setCustomerPhone] = useState("");
	const [customerEmail, setCustomerEmail] = useState("");
	const [boardingPoint, setBoardingPoint] = useState("");
	const [droppingPoint, setDroppingPoint] = useState("");

	useEffect(() => {
		async function loadBus() {
			try {
				const response = await apiFetch(`/api/buses/${busId}`);
				if (response.ok) {
					setBusData(await response.json());
				} else {
					toast.error("Không tìm thấy thông tin xe.");
					navigate({ to: "/" });
				}
			} catch (error) {
				console.error("Failed to load bus:", error);
				toast.error("Có lỗi khi tải thông tin xe.");
				navigate({ to: "/" });
			} finally {
				setIsLoading(false);
			}
		}
		loadBus();
	}, [busId, navigate]);

	const totalPrice = (busData?.fare ?? 0) * selectedSeats.length;

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat("vi-VN").format(price) + "đ";
	};

	const handleCancel = () => {
		navigate({ to: "/" });
	};

	const handlePayment = async () => {
		if (!busData) return;
		const customerId = localStorage.getItem("customerId") ?? "";
		try {
			const response = await apiFetch("/api/bookings", {
				method: "POST",
				body: JSON.stringify({
					busId: busData.id,
					customerId,
					seats: selectedSeats,
					totalFare: totalPrice,
					boardingPoint,
					droppingPoint,
				}),
			});
			if (response.ok) {
				sessionStorage.setItem(
					"pendingBooking",
					JSON.stringify({
						busId: busData.id,
						customerId,
						totalPrice,
						boardingPoint,
						droppingPoint,
					}),
				);
				navigate({ to: "/payment" });
			} else {
				toast.error("Đặt vé thất bại. Vui lòng thử lại.");
			}
		} catch (error) {
			console.error("Booking error:", error);
			toast.error("Có lỗi khi đặt vé.");
		}
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-24 text-gray-500">
				Đang tải thông tin chuyến xe...
			</div>
		);
	}

	if (!busData) return null;

	return (
		<div className="flex gap-6">
			{/* Left column - Form */}
			<div className="flex-1 space-y-6">
				{/* Seat selection */}
				<div className="p-6 bg-white border border-gray-200 rounded-2xl">
					<SeatSelector
						seats={busData.seats}
						maxSeats={5}
						onSelectionChange={setSelectedSeats}
					/>
				</div>

				{/* Customer information */}
				<div className="p-6 bg-white border border-gray-200 rounded-2xl">
					<h3 className="mb-4 text-lg font-semibold">Thông tin khách hàng</h3>
					<div className="space-y-4">
						<div>
							<Label htmlFor="name" className="text-sm">
								Họ tên
							</Label>
							<Input
								id="name"
								value={customerName}
								onChange={(e) => setCustomerName(e.target.value)}
								placeholder="Nhập họ tên"
								className="mt-1"
							/>
						</div>
						<div>
							<Label htmlFor="phone" className="text-sm">
								Số điện thoại
							</Label>
							<Input
								id="phone"
								type="tel"
								value={customerPhone}
								onChange={(e) => setCustomerPhone(e.target.value)}
								placeholder="Nhập số điện thoại"
								className="mt-1"
							/>
						</div>
						<div>
							<Label htmlFor="email" className="text-sm">
								Email
							</Label>
							<Input
								id="email"
								type="email"
								value={customerEmail}
								onChange={(e) => setCustomerEmail(e.target.value)}
								placeholder="Nhập email"
								className="mt-1"
							/>
						</div>
					</div>
				</div>

				{/* Pickup/Dropoff points */}
				<div className="p-6 bg-white border border-gray-200 rounded-2xl">
					<h3 className="mb-4 text-lg font-semibold">Thông tin đón trả</h3>
					<div className="grid grid-cols-2 gap-6">
						<div>
							<Label className="text-sm font-medium text-gray-700">
								ĐIỂM ĐÓN
							</Label>
							<Select value={boardingPoint} onValueChange={setBoardingPoint}>
								<SelectTrigger className="mt-2">
									<SelectValue placeholder="Chọn điểm đón" />
								</SelectTrigger>
								<SelectContent>
									{busData.boardingPoints.map((point) => (
										<SelectItem key={point} value={point}>
											{point}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div>
							<Label className="text-sm font-medium text-gray-700">
								ĐIỂM TRẢ
							</Label>
							<Select value={droppingPoint} onValueChange={setDroppingPoint}>
								<SelectTrigger className="mt-2">
									<SelectValue placeholder="Chọn điểm trả" />
								</SelectTrigger>
								<SelectContent>
									{busData.droppingPoints.map((point) => (
										<SelectItem key={point} value={point}>
											{point}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>

				{/* Payment buttons */}
				<div className="p-6 bg-white border border-gray-200 rounded-2xl">
					<div className="flex items-center justify-between">
						<div>
							<span className="text-gray-600">Tổng thanh toán: </span>
							<span className="text-2xl font-bold text-orange-600">
								{formatPrice(totalPrice)}
							</span>
						</div>
						<div className="flex gap-3">
							<Button variant="outline" onClick={handleCancel}>
								Hủy
							</Button>
							<Button
								onClick={handlePayment}
								disabled={selectedSeats.length === 0}
								className="text-white bg-orange-600 hover:bg-orange-600/90"
							>
								Thanh toán
							</Button>
						</div>
					</div>
				</div>
			</div>

			{/* Right column - Trip info */}
			<div className="flex-shrink-0 w-80 space-y-6">
				{/* Trip details */}
				<div className="p-6 bg-white border border-gray-200 rounded-2xl">
					<h3 className="mb-4 text-lg font-semibold">Thông tin lượt đi</h3>
					<div className="text-sm space-y-3">
						<div className="flex justify-between">
							<span className="text-gray-600">Tuyến xe đi</span>
							<span className="font-medium">{busData.departureLocation}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-600">Tuyến xe tới</span>
							<span className="font-medium">{busData.arrivalLocation}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-600">Thời gian xuất bến</span>
							<span className="font-medium">
								{format(new Date(busData.departureTime), "HH:mm dd/MM/yyyy")}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-600">Số lượng ghế</span>
							<span className="font-medium">{selectedSeats.length} ghế</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-600">Số ghế</span>
							<span className="font-medium text-orange-600">
								{selectedSeats.length > 0 ? selectedSeats.join(", ") : "-"}
							</span>
						</div>
						<div className="flex justify-between pt-2 border-t">
							<span className="text-gray-600">Tổng tiền lượt đi</span>
							<span className="font-bold text-orange-600">
								{formatPrice(totalPrice)}
							</span>
						</div>
					</div>
				</div>

				{/* Price details */}
				<div className="p-6 bg-white border border-gray-200 rounded-2xl">
					<h3 className="mb-4 text-lg font-semibold">Chi tiết giá</h3>
					<div className="text-sm space-y-3">
						<div className="flex justify-between">
							<span className="text-gray-600">
								Giá vé ({selectedSeats.length} ghế)
							</span>
							<span className="font-medium">{formatPrice(totalPrice)}</span>
						</div>
						<hr />
						<div className="flex justify-between pt-2">
							<span className="font-semibold">Tổng tiền</span>
							<span className="text-xl font-bold text-orange-600">
								{formatPrice(totalPrice)}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
