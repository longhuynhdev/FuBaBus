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

interface InvoiceData {
	invoiceID: string;
	name: string;
	phone: string;
	email: string;
	price: string;
	paymentMethod: string;
	status: string;
	buses: string;
	time: string;
	seats: string;
	boardingPoint: string;
}

interface LookupForm {
	phoneNumber: string;
	invoiceID: string;
}

export function InvoiceLookup() {
	const [isOpen, setIsOpen] = useState(false);
	const [formLookup, setFormLookup] = useState<LookupForm>({
		phoneNumber: "",
		invoiceID: "",
	});
	const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);

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
			//   `http://localhost:8080/api/invoices/phone/${formLookup.phoneNumber}/invoiceID/${formLookup.invoiceID}`
			// );
			// const data = await response.json();
			// setInvoiceData(data);

			// Mock data for now
			setInvoiceData({
				invoiceID: formLookup.invoiceID,
				name: "Long Huynh",
				phone: formLookup.phoneNumber,
				email: "suikax86@gmail.com",
				price: "250,000 VND",
				paymentMethod: "Chuyển khoản",
				status: "Đã thanh toán",
				buses: "TP.HCM - Đà Lạt",
				time: "08:00 - 15/01/2026",
				seats: "A1, A2",
				boardingPoint: "Bến xe Miền Đông",
			});
			setIsOpen(true);
		} catch (error) {
			console.error("Failed to fetch invoice data:", error);
			alert("Có lỗi xảy ra khi tra cứu hóa đơn");
		}
	};

	return (
		<>
			<div className="max-w-md mx-auto">
				<h1 className="text-2xl font-bold text-center mb-8 uppercase">
					Tra cứu thông tin hóa đơn
				</h1>

				<form onSubmit={handleSubmit} className="space-y-4">
					<Input
						type="text"
						name="phoneNumber"
						placeholder="Số điện thoại"
						value={formLookup.phoneNumber}
						onChange={handleChange}
						required
					/>
					<Input
						type="text"
						name="invoiceID"
						placeholder="Mã hóa đơn"
						value={formLookup.invoiceID}
						onChange={handleChange}
						required
					/>
					<div className="flex justify-center pt-4">
						<Button
							type="submit"
							className="w-[180px] h-[46px] rounded-full bg-orange-600 hover:bg-orange-600/80 text-white font-semibold"
						>
							Tra cứu hóa đơn
						</Button>
					</div>
				</form>
			</div>

			{/* Invoice Modal */}
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle className="text-xl">
							Hóa đơn:{" "}
							<span className="text-orange-600">{invoiceData?.invoiceID}</span>
						</DialogTitle>
					</DialogHeader>

					{invoiceData && (
						<div className="space-y-6">
							{/* Customer Info */}
							<div className="space-y-4 p-4 bg-gray-50 rounded-lg">
								<h3 className="font-semibold text-gray-700">
									Thông tin khách hàng
								</h3>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<Label className="text-sm font-medium">Họ tên:</Label>
										<Input
											value={invoiceData.name}
											disabled
											className="mt-1 bg-white"
										/>
									</div>
									<div>
										<Label className="text-sm font-medium">Tổng giá vé:</Label>
										<Input
											value={invoiceData.price}
											disabled
											className="mt-1 bg-white"
										/>
									</div>
									<div>
										<Label className="text-sm font-medium">
											Số điện thoại:
										</Label>
										<Input
											value={invoiceData.phone}
											disabled
											className="mt-1 bg-white"
										/>
									</div>
									<div>
										<Label className="text-sm font-medium">PTTT:</Label>
										<Input
											value={invoiceData.paymentMethod}
											disabled
											className="mt-1 bg-white"
										/>
									</div>
									<div>
										<Label className="text-sm font-medium">Email:</Label>
										<Input
											value={invoiceData.email}
											disabled
											className="mt-1 bg-white"
										/>
									</div>
									<div>
										<Label className="text-sm font-medium">Trạng thái:</Label>
										<Input
											value={invoiceData.status}
											disabled
											className="mt-1 bg-white"
										/>
									</div>
								</div>
							</div>

							{/* Invoice Details */}
							<div className="space-y-4 p-4 bg-gray-50 rounded-lg">
								<h3 className="font-semibold text-gray-700">
									Chi tiết hóa đơn
								</h3>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<Label className="text-sm font-medium">Tuyến xe:</Label>
										<Input
											value={invoiceData.buses}
											disabled
											className="mt-1 bg-white"
										/>
									</div>
									<div>
										<Label className="text-sm font-medium">Xuất bến:</Label>
										<Input
											value={invoiceData.time}
											disabled
											className="mt-1 bg-white"
										/>
									</div>
								</div>
								<div>
									<Label className="text-sm font-medium">Số ghế:</Label>
									<Input
										value={invoiceData.seats}
										disabled
										className="mt-1 bg-white"
									/>
								</div>
								<div>
									<Label className="text-sm font-medium">Điểm lên xe:</Label>
									<Input
										value={invoiceData.boardingPoint}
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
