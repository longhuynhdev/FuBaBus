import { useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { useState } from "react";
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
import { SeatSelector } from "./seat-selector";

// Mock data
const mockBusData = {
	id: "1",
	departureLocation: "TP Hồ Chí Minh",
	arrivalLocation: "Đà Lạt",
	departureTime: new Date("2026-02-10T08:00:00"),
	fare: 250000,
	busType: "Giường nằm 40 chỗ",
	boardingPoints: ["Bến xe Miền Đông", "Bến xe An Sương", "Ngã tư Thủ Đức"],
	droppingPoints: ["Bến xe Đà Lạt", "Chợ Đà Lạt", "Hồ Xuân Hương"],
	seats: [
		{ seatNumber: "A1", isBooked: false },
		{ seatNumber: "A2", isBooked: true },
		{ seatNumber: "A3", isBooked: false },
		{ seatNumber: "A4", isBooked: false },
		{ seatNumber: "B1", isBooked: false },
		{ seatNumber: "B2", isBooked: false },
		{ seatNumber: "B3", isBooked: true },
		{ seatNumber: "B4", isBooked: false },
		{ seatNumber: "C1", isBooked: true },
		{ seatNumber: "C2", isBooked: false },
		{ seatNumber: "C3", isBooked: false },
		{ seatNumber: "C4", isBooked: true },
	],
};

export function BookingForm() {
	const navigate = useNavigate();
	const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
	const [customerName, setCustomerName] = useState("");
	const [customerPhone, setCustomerPhone] = useState("");
	const [customerEmail, setCustomerEmail] = useState("");
	const [boardingPoint, setBoardingPoint] = useState("");
	const [droppingPoint, setDroppingPoint] = useState("");

	const totalPrice = mockBusData.fare * selectedSeats.length;

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat("vi-VN").format(price) + "đ";
	};

	const handleCancel = () => {
		navigate({ to: "/" });
	};

	const handlePayment = () => {
		// TODO: Call API to book
		console.log("Booking:", {
			busId: mockBusData.id,
			seats: selectedSeats,
			customerName,
			customerPhone,
			customerEmail,
			boardingPoint,
			droppingPoint,
			totalPrice,
		});
		// Navigate to payment page
		// navigate({ to: "/payment" });
		alert("Chuyển đến trang thanh toán...");
	};

	return (
		<div className="flex gap-6">
			{/* Left column - Form */}
			<div className="flex-1 space-y-6">
				{/* Seat selection */}
				<div className="bg-white rounded-2xl p-6 border border-gray-200">
					<SeatSelector
						seats={mockBusData.seats}
						maxSeats={5}
						onSelectionChange={setSelectedSeats}
					/>
				</div>

				{/* Customer information */}
				<div className="bg-white rounded-2xl p-6 border border-gray-200">
					<h3 className="text-lg font-semibold mb-4">Thông tin khách hàng</h3>
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
				<div className="bg-white rounded-2xl p-6 border border-gray-200">
					<h3 className="text-lg font-semibold mb-4">Thông tin đón trả</h3>
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
									{mockBusData.boardingPoints.map((point) => (
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
									{mockBusData.droppingPoints.map((point) => (
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
				<div className="bg-white rounded-2xl p-6 border border-gray-200">
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
								className="bg-orange-600 hover:bg-orange-600/90 text-white"
							>
								Thanh toán
							</Button>
						</div>
					</div>
				</div>
			</div>

			{/* Right column - Trip info */}
			<div className="w-80 flex-shrink-0 space-y-6">
				{/* Trip details */}
				<div className="bg-white rounded-2xl p-6 border border-gray-200">
					<h3 className="text-lg font-semibold mb-4">Thông tin lượt đi</h3>
					<div className="space-y-3 text-sm">
						<div className="flex justify-between">
							<span className="text-gray-600">Tuyến xe đi</span>
							<span className="font-medium">
								{mockBusData.departureLocation}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-600">Tuyến xe tới</span>
							<span className="font-medium">{mockBusData.arrivalLocation}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-600">Thời gian xuất bến</span>
							<span className="font-medium">
								{format(mockBusData.departureTime, "HH:mm dd/MM/yyyy")}
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
				<div className="bg-white rounded-2xl p-6 border border-gray-200">
					<h3 className="text-lg font-semibold mb-4">Chi tiết giá</h3>
					<div className="space-y-3 text-sm">
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
