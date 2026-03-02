import { useNavigate } from "@tanstack/react-router";
import { Banknote, Bus, Clock } from "lucide-react";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export interface BusData {
	id: string;
	departureTime: string;
	arrivalTime: string;
	departureLocation: string;
	arrivalLocation: string;
	busType: string;
	fare: number;
	availableSeats: number;
}

interface BusListProps {
	buses: BusData[];
	isLoading: boolean;
}

export function BusList({ buses, isLoading }: BusListProps) {
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
		<div className="flex mt-8 gap-6">
			{/* Filter sidebar */}
			<div className="flex-shrink-0 w-72">
				<div className="p-6 bg-white border border-gray-200 rounded-2xl">
					<h2 className="mb-4 text-lg font-semibold">Bộ lọc tìm kiếm</h2>

					{/* Time filter */}
					<div className="mb-6">
						<h3 className="mb-3 font-medium">Giờ đi</h3>
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
						<h3 className="mb-3 font-medium">Loại xe</h3>
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
				<div className="flex mb-4 gap-4">
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
								<Banknote className="w-4 h-4" />
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
								<Banknote className="w-4 h-4" />
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
								<Clock className="w-4 h-4" />
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
								<Clock className="w-4 h-4" />
								Giờ muộn nhất
							</Label>
						</div>
					</RadioGroup>
				</div>

				{/* Bus cards */}
				<div className="space-y-4">
					{isLoading ? (
						<p className="py-8 text-center text-gray-500">Đang tìm kiếm...</p>
					) : buses.length === 0 ? (
						<p className="py-8 text-center text-gray-500">
							Không tìm thấy chuyến xe phù hợp.
						</p>
					) : (
						buses.map((bus) => (
							<div
								key={bus.id}
								onClick={() => handleSelectBus(bus.id)}
								className="p-6 bg-white border border-gray-200 cursor-pointer rounded-2xl hover:border-orange-300 hover:shadow-md transition-all"
							>
								<div className="flex items-center justify-between">
									{/* Departure info */}
									<div className="text-center">
										<div className="text-2xl font-bold text-gray-900">
											{bus.departureTime}
										</div>
										<div className="mt-1 text-sm text-gray-500">
											{bus.departureLocation}
										</div>
									</div>

									{/* Journey visualization */}
									<div className="flex items-center justify-center flex-1 mx-8">
										<div className="flex items-center text-gray-400 gap-2">
											<div className="w-3 h-3 bg-orange-500 rounded-full" />
											<div className="flex-1 border-t-2 border-dashed border-gray-300 min-w-[100px]" />
											<div className="text-xs text-gray-500">6 giờ</div>
											<div className="flex-1 border-t-2 border-dashed border-gray-300 min-w-[100px]" />
											<div className="w-3 h-3 bg-green-500 rounded-full" />
										</div>
									</div>

									{/* Arrival info */}
									<div className="text-center">
										<div className="text-2xl font-bold text-gray-900">
											{bus.arrivalTime}
										</div>
										<div className="mt-1 text-sm text-gray-500">
											{bus.arrivalLocation}
										</div>
									</div>

									{/* Bus type */}
									<div className="mx-8 text-center">
										<div className="flex items-center text-gray-600 gap-2">
											<Bus className="w-5 h-5" />
											<span className="text-sm">{bus.busType}</span>
										</div>
									</div>

									{/* Price and availability */}
									<div className="text-right">
										<div className="text-sm text-gray-500">
											Còn {bus.availableSeats} chỗ
										</div>
										<div className="mt-1 text-xl font-bold text-orange-600">
											{formatPrice(bus.fare)}
										</div>
									</div>
								</div>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
}
