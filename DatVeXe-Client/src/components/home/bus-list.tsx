import { useNavigate } from "@tanstack/react-router";
import { Banknote, Bus, Clock } from "lucide-react";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface BusData {
	id: string;
	departureTime: string;
	arrivalTime: string;
	departureLocation: string;
	arrivalLocation: string;
	busType: string;
	fare: number;
	availableSeats: number;
}

// Mock data for display
const mockBuses: BusData[] = [
	{
		id: "1",
		departureTime: "06:00",
		arrivalTime: "12:00",
		departureLocation: "Bến xe Miền Đông",
		arrivalLocation: "Bến xe Đà Lạt",
		busType: "Giường nằm 40 chỗ",
		fare: 250000,
		availableSeats: 20,
	},
	{
		id: "2",
		departureTime: "08:30",
		arrivalTime: "14:30",
		departureLocation: "Bến xe Miền Đông",
		arrivalLocation: "Bến xe Đà Lạt",
		busType: "Limousine 24 chỗ",
		fare: 350000,
		availableSeats: 12,
	},
	{
		id: "3",
		departureTime: "14:00",
		arrivalTime: "20:00",
		departureLocation: "Bến xe Miền Đông",
		arrivalLocation: "Bến xe Đà Lạt",
		busType: "Ghế ngồi 45 chỗ",
		fare: 180000,
		availableSeats: 30,
	},
	{
		id: "4",
		departureTime: "22:00",
		arrivalTime: "04:00",
		departureLocation: "Bến xe Miền Đông",
		arrivalLocation: "Bến xe Đà Lạt",
		busType: "Giường nằm 40 chỗ",
		fare: 280000,
		availableSeats: 15,
	},
];

export function BusList() {
	const navigate = useNavigate();
	const [timeFilter, setTimeFilter] = useState("");
	const [busTypeFilter, setBusTypeFilter] = useState("");
	const [sortBy, setSortBy] = useState("");

	const handleSelectBus = (busId: string) => {
		navigate({ to: "/booking/$id", params: { id: busId } });
	};

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat("vi-VN").format(price) + "đ";
	};

	return (
		<div className="flex gap-6 mt-8">
			{/* Filter sidebar */}
			<div className="w-72 flex-shrink-0">
				<div className="bg-white rounded-2xl p-6 border border-gray-200">
					<h2 className="text-lg font-semibold mb-4">Bộ lọc tìm kiếm</h2>

					{/* Time filter */}
					<div className="mb-6">
						<h3 className="font-medium mb-3">Giờ đi</h3>
						<RadioGroup value={timeFilter} onValueChange={setTimeFilter}>
							<div className="space-y-2">
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="early-morning" id="early-morning" />
									<Label
										htmlFor="early-morning"
										className="text-sm cursor-pointer"
									>
										Sáng sớm 00:00 - 06:00
									</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="morning" id="morning" />
									<Label htmlFor="morning" className="text-sm cursor-pointer">
										Buổi sáng 06:00 - 12:00
									</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="afternoon" id="afternoon" />
									<Label htmlFor="afternoon" className="text-sm cursor-pointer">
										Buổi chiều 12:00 - 18:00
									</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="night" id="night" />
									<Label htmlFor="night" className="text-sm cursor-pointer">
										Buổi tối 18:00 - 24:00
									</Label>
								</div>
							</div>
						</RadioGroup>
					</div>

					<hr className="my-4" />

					{/* Bus type filter */}
					<div>
						<h3 className="font-medium mb-3">Loại xe</h3>
						<RadioGroup value={busTypeFilter} onValueChange={setBusTypeFilter}>
							<div className="flex flex-wrap gap-4">
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="seat" id="seat" />
									<Label htmlFor="seat" className="text-sm cursor-pointer">
										Ghế
									</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="sleeper" id="sleeper" />
									<Label htmlFor="sleeper" className="text-sm cursor-pointer">
										Giường
									</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="limousine" id="limousine" />
									<Label htmlFor="limousine" className="text-sm cursor-pointer">
										Limousine
									</Label>
								</div>
							</div>
						</RadioGroup>
					</div>
				</div>
			</div>

			{/* Bus list */}
			<div className="flex-1">
				{/* Quick sort buttons */}
				<div className="flex gap-4 mb-4">
					<RadioGroup
						value={sortBy}
						onValueChange={setSortBy}
						className="flex gap-4"
					>
						<div className="flex items-center">
							<RadioGroupItem
								value="price-asc"
								id="price-asc"
								className="sr-only"
							/>
							<Label
								htmlFor="price-asc"
								className={`flex items-center gap-2 px-4 py-2 rounded-full border cursor-pointer transition-colors ${
									sortBy === "price-asc"
										? "bg-orange-100 border-orange-500 text-orange-700"
										: "bg-white border-gray-300 hover:border-orange-300"
								}`}
							>
								<Banknote className="h-4 w-4" />
								Giá tăng dần
							</Label>
						</div>
						<div className="flex items-center">
							<RadioGroupItem
								value="price-desc"
								id="price-desc"
								className="sr-only"
							/>
							<Label
								htmlFor="price-desc"
								className={`flex items-center gap-2 px-4 py-2 rounded-full border cursor-pointer transition-colors ${
									sortBy === "price-desc"
										? "bg-orange-100 border-orange-500 text-orange-700"
										: "bg-white border-gray-300 hover:border-orange-300"
								}`}
							>
								<Banknote className="h-4 w-4" />
								Giá giảm dần
							</Label>
						</div>
						<div className="flex items-center">
							<RadioGroupItem
								value="time-asc"
								id="time-asc"
								className="sr-only"
							/>
							<Label
								htmlFor="time-asc"
								className={`flex items-center gap-2 px-4 py-2 rounded-full border cursor-pointer transition-colors ${
									sortBy === "time-asc"
										? "bg-orange-100 border-orange-500 text-orange-700"
										: "bg-white border-gray-300 hover:border-orange-300"
								}`}
							>
								<Clock className="h-4 w-4" />
								Giờ sớm nhất
							</Label>
						</div>
						<div className="flex items-center">
							<RadioGroupItem
								value="time-desc"
								id="time-desc"
								className="sr-only"
							/>
							<Label
								htmlFor="time-desc"
								className={`flex items-center gap-2 px-4 py-2 rounded-full border cursor-pointer transition-colors ${
									sortBy === "time-desc"
										? "bg-orange-100 border-orange-500 text-orange-700"
										: "bg-white border-gray-300 hover:border-orange-300"
								}`}
							>
								<Clock className="h-4 w-4" />
								Giờ muộn nhất
							</Label>
						</div>
					</RadioGroup>
				</div>

				{/* Bus cards */}
				<div className="space-y-4">
					{mockBuses.map((bus) => (
						<div
							key={bus.id}
							onClick={() => handleSelectBus(bus.id)}
							className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-orange-300 hover:shadow-md cursor-pointer transition-all"
						>
							<div className="flex items-center justify-between">
								{/* Departure info */}
								<div className="text-center">
									<div className="text-2xl font-bold text-gray-900">
										{bus.departureTime}
									</div>
									<div className="text-sm text-gray-500 mt-1">
										{bus.departureLocation}
									</div>
								</div>

								{/* Journey visualization */}
								<div className="flex-1 mx-8 flex items-center justify-center">
									<div className="flex items-center gap-2 text-gray-400">
										<div className="w-3 h-3 rounded-full bg-orange-500" />
										<div className="flex-1 border-t-2 border-dashed border-gray-300 min-w-[100px]" />
										<div className="text-xs text-gray-500">6 giờ</div>
										<div className="flex-1 border-t-2 border-dashed border-gray-300 min-w-[100px]" />
										<div className="w-3 h-3 rounded-full bg-green-500" />
									</div>
								</div>

								{/* Arrival info */}
								<div className="text-center">
									<div className="text-2xl font-bold text-gray-900">
										{bus.arrivalTime}
									</div>
									<div className="text-sm text-gray-500 mt-1">
										{bus.arrivalLocation}
									</div>
								</div>

								{/* Bus type */}
								<div className="mx-8 text-center">
									<div className="flex items-center gap-2 text-gray-600">
										<Bus className="h-5 w-5" />
										<span className="text-sm">{bus.busType}</span>
									</div>
								</div>

								{/* Price and availability */}
								<div className="text-right">
									<div className="text-sm text-gray-500">
										Còn {bus.availableSeats} chỗ
									</div>
									<div className="text-xl font-bold text-orange-600 mt-1">
										{formatPrice(bus.fare)}
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
