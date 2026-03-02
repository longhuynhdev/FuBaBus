import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Building2, CreditCard, Wallet } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface PaymentFormProps {
	totalPrice?: number;
	boardingPoint?: string;
	droppingPoint?: string;
}

const paymentMethods = [
	{
		id: "zalopay",
		name: "ZaloPay",
		icon: Wallet,
		description: "Thanh toán qua ví ZaloPay",
	},
	{
		id: "atm",
		name: "Thẻ ATM nội địa",
		icon: Building2,
		description: "Thanh toán qua thẻ ATM/Internet Banking",
	},
	{
		id: "visa",
		name: "Thẻ Visa/Master/JCB",
		icon: CreditCard,
		description: "Thanh toán qua thẻ quốc tế",
	},
];

export function PaymentForm({
	totalPrice = 500000,
	boardingPoint = "Bến xe Miền Đông",
	droppingPoint = "Bến xe Đà Lạt",
}: PaymentFormProps) {
	const navigate = useNavigate();
	const [paymentMethod, setPaymentMethod] = useState("zalopay");
	const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes in seconds
	const timerRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		timerRef.current = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev <= 1) {
					if (timerRef.current) clearInterval(timerRef.current);
					// Time's up - go back
					navigate({ to: "/" });
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
		};
	}, [navigate]);

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	};

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat("vi-VN").format(price) + "đ";
	};

	const handleGoBack = () => {
		navigate({ to: "/" });
	};

	const handlePayment = () => {
		// TODO: Call payment API
		console.log("Processing payment with method:", paymentMethod);
		alert(
			`Đặt vé thành công!\nMã hóa đơn: INV${Date.now()}\nMã vé xe: TKT${Date.now()}`,
		);
		navigate({ to: "/" });
	};

	return (
		<div className="max-w-4xl mx-auto">
			<div className="overflow-hidden bg-white border border-gray-200 rounded-2xl">
				{/* Header */}
				<div className="flex items-center justify-between p-4 border-b">
					<button
						onClick={handleGoBack}
						className="flex items-center text-gray-600 gap-2 hover:text-gray-900 transition-colors"
					>
						<ArrowLeft className="w-5 h-5" />
						<span>Quay lại</span>
					</button>

					<div className="text-center">
						<p className="text-xl font-semibold">
							{boardingPoint} → {droppingPoint}
						</p>
					</div>

					<div className="w-20" />
				</div>

				{/* Content */}
				<div className="p-8">
					<div className="flex gap-12">
						{/* Payment methods */}
						<div className="flex-1">
							<h2 className="mb-6 text-xl font-medium">
								Chọn phương thức thanh toán
							</h2>

							<RadioGroup
								value={paymentMethod}
								onValueChange={setPaymentMethod}
								className="space-y-4"
							>
								{paymentMethods.map((method) => {
									const Icon = method.icon;
									return (
										<div
											key={method.id}
											className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
												paymentMethod === method.id
													? "border-orange-500 bg-orange-50"
													: "border-gray-200 hover:border-gray-300"
											}`}
											onClick={() => setPaymentMethod(method.id)}
										>
											<RadioGroupItem
												value={method.id}
												id={method.id}
												className="mr-4"
											/>
											<Icon className="w-8 h-8 mr-4 text-gray-600" />
											<div>
												<Label
													htmlFor={method.id}
													className="font-medium cursor-pointer"
												>
													{method.name}
												</Label>
												<p className="text-sm text-gray-500">
													{method.description}
												</p>
											</div>
										</div>
									);
								})}
							</RadioGroup>
						</div>

						{/* Total and timer */}
						<div className="text-center w-80">
							<div className="mb-4">
								<span className="text-gray-600">Tổng thanh toán</span>
							</div>
							<div className="mb-4 text-5xl font-bold text-orange-600">
								{formatPrice(totalPrice)}
							</div>
							<div className="text-sm text-gray-500">
								Thời gian giữ chỗ còn lại:{" "}
								<span
									className={`font-mono font-bold ${timeLeft < 60 ? "text-red-600" : "text-orange-600"}`}
								>
									{formatTime(timeLeft)}
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* Footer */}
				<div className="p-6 border-t bg-gray-50">
					<Button
						onClick={handlePayment}
						className="w-full h-12 text-lg font-semibold text-white bg-orange-600 rounded-full hover:bg-orange-600/90"
					>
						Thanh toán
					</Button>
				</div>
			</div>
		</div>
	);
}
