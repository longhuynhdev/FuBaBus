import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TicketData {
	busId: string;
	customerId: string;
	departureTime: string;
	departureLocation: string;
	arrivalTime: string;
	arrivalLocation: string;
	boardingPoint: string;
	droppingPoint: string;
	busType: string;
	totalFare: string;
	seats: string;
}

interface LookupForm {
	phoneNumber: string;
	ticketID: string;
}

export function TicketLookup() {
	const [isOpen, setIsOpen] = useState(false);
	const [formLookup, setFormLookup] = useState<LookupForm>({
		phoneNumber: "",
		ticketID: "",
	});
	const [ticketData, setTicketData] = useState<TicketData | null>(null);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setFormLookup((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault();
		// TODO: Replace with actual API call using fetch
		try {
			// const response = await fetch(
			//   `http://localhost:8080/api/tickets/${formLookup.ticketID}/${formLookup.phoneNumber}`
			// );
			// const data = await response.json();
			// setTicketData(data);

			// Mock data for now
			setTicketData({
				busId: "BUS001",
				customerId: "CUST001",
				departureTime: "08:00",
				departureLocation: "TP. Hồ Chí Minh",
				arrivalTime: "14:00",
				arrivalLocation: "Đà Lạt",
				boardingPoint: "Bến xe Miền Đông",
				droppingPoint: "Bến xe Đà Lạt",
				busType: "Giường nằm 40 chỗ",
				totalFare: "250,000 VND",
				seats: "A1, A2",
			});
			setIsOpen(true);
		} catch (error) {
			console.error("Failed to fetch ticket data:", error);
		}
	};

	return (
		<>
			<div className="max-w-md mx-auto">
				<h1 className="text-2xl font-bold text-center mb-8 uppercase">
					Tra cứu thông tin đặt vé
				</h1>

				<form onSubmit={handleSubmit} className="space-y-4">
					<Input
						type="text"
						name="phoneNumber"
						placeholder="Vui lòng nhập số điện thoại"
						value={formLookup.phoneNumber}
						onChange={handleChange}
						required
					/>
					<Input
						type="text"
						name="ticketID"
						placeholder="Vui lòng nhập mã vé"
						value={formLookup.ticketID}
						onChange={handleChange}
						required
					/>
					<div className="flex justify-center pt-4">
						<Button
							type="submit"
							className="w-[180px] h-[46px] rounded-full bg-orange-600 hover:bg-orange-600/80 text-white font-semibold"
						>
							Tra cứu vé
						</Button>
					</div>
				</form>
			</div>

			{/* Ticket Modal */}
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle className="text-xl">
							Mã vé xe:{" "}
							<span className="text-orange-600">{formLookup.ticketID}</span>
						</DialogTitle>
					</DialogHeader>

					{ticketData && (
						<div className="space-y-6">
							{/* Basic Info */}
							<div className="space-y-4 p-4 bg-gray-50 rounded-lg">
								<h3 className="font-semibold text-gray-700">
									Thông tin khách hàng
								</h3>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<Label className="text-sm font-medium">Họ tên:</Label>
										<Input
											value="Long Huynh"
											disabled
											className="mt-1 bg-white"
										/>
									</div>
									<div>
										<Label className="text-sm font-medium">Email:</Label>
										<Input
											value="suikax86@gmail.com"
											disabled
											className="mt-1 bg-white"
										/>
									</div>
									<div>
										<Label className="text-sm font-medium">
											Số điện thoại:
										</Label>
										<Input
											value={formLookup.phoneNumber}
											disabled
											className="mt-1 bg-white"
										/>
									</div>
								</div>
							</div>

							{/* Ticket Details */}
							<div className="space-y-4 p-4 bg-gray-50 rounded-lg">
								<h3 className="font-semibold text-gray-700">Chi tiết vé</h3>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<Label className="text-sm font-medium">Mã Bus:</Label>
										<Input
											value={ticketData.busId}
											disabled
											className="mt-1 bg-white"
										/>
									</div>
									<div>
										<Label className="text-sm font-medium">
											Mã khách hàng:
										</Label>
										<Input
											value={ticketData.customerId}
											disabled
											className="mt-1 bg-white"
										/>
									</div>
									<div>
										<Label className="text-sm font-medium">
											Giờ khởi hành:
										</Label>
										<Input
											value={ticketData.departureTime}
											disabled
											className="mt-1 bg-white"
										/>
									</div>
									<div>
										<Label className="text-sm font-medium">Địa điểm đi:</Label>
										<Input
											value={ticketData.departureLocation}
											disabled
											className="mt-1 bg-white"
										/>
									</div>
									<div>
										<Label className="text-sm font-medium">
											Thời gian đến:
										</Label>
										<Input
											value={ticketData.arrivalTime}
											disabled
											className="mt-1 bg-white"
										/>
									</div>
									<div>
										<Label className="text-sm font-medium">Địa điểm đến:</Label>
										<Input
											value={ticketData.arrivalLocation}
											disabled
											className="mt-1 bg-white"
										/>
									</div>
								</div>
								<div>
									<Label className="text-sm font-medium">Điểm đón:</Label>
									<Input
										value={ticketData.boardingPoint}
										disabled
										className="mt-1 bg-white"
									/>
								</div>
								<div>
									<Label className="text-sm font-medium">Điểm xuống:</Label>
									<Input
										value={ticketData.droppingPoint}
										disabled
										className="mt-1 bg-white"
									/>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<Label className="text-sm font-medium">Loại xe bus:</Label>
										<Input
											value={ticketData.busType}
											disabled
											className="mt-1 bg-white"
										/>
									</div>
									<div>
										<Label className="text-sm font-medium">Tổng tiền vé:</Label>
										<Input
											value={ticketData.totalFare}
											disabled
											className="mt-1 bg-white"
										/>
									</div>
								</div>
								<div>
									<Label className="text-sm font-medium">
										Danh sách ghế đặt:
									</Label>
									<Input
										value={ticketData.seats}
										disabled
										className="mt-1 bg-white"
									/>
								</div>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</>
	);
}
