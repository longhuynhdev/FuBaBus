import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { ArrowLeftRight, CalendarIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface BusSearchFormProps {
	onSearch: (searchParams: SearchParams) => void;
}

export interface SearchParams {
	departureLocation: string;
	arrivalLocation: string;
	departureDate: Date;
	returnDate?: Date;
	ticketCount: number;
	tripType: "one-way" | "round-trip";
}

const locations = [
	"TP Hồ Chí Minh",
	"Đà Lạt",
	"Đà Nẵng",
	"Khánh Hoà",
	"Hà Nội",
	"Nha Trang",
];

export function BusSearchForm({ onSearch }: BusSearchFormProps) {
	const [tripType, setTripType] = useState<"one-way" | "round-trip">("one-way");
	const [departureLocation, setDepartureLocation] = useState("");
	const [arrivalLocation, setArrivalLocation] = useState("");
	const [departureDate, setDepartureDate] = useState<Date>(new Date());
	const [returnDate, setReturnDate] = useState<Date>(new Date());
	const [ticketCount, setTicketCount] = useState("1");

	const swapLocations = () => {
		const temp = departureLocation;
		setDepartureLocation(arrivalLocation);
		setArrivalLocation(temp);
	};

	const handleSearch = () => {
		onSearch({
			departureLocation,
			arrivalLocation,
			departureDate,
			returnDate: tripType === "round-trip" ? returnDate : undefined,
			ticketCount: parseInt(ticketCount),
			tripType,
		});
	};

	return (
		<div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
			{/* Trip type selection */}
			<div className="flex items-center justify-between mb-6">
				<RadioGroup
					value={tripType}
					onValueChange={(value) =>
						setTripType(value as "one-way" | "round-trip")
					}
					className="flex gap-6"
				>
					<div className="flex items-center space-x-2">
						<RadioGroupItem value="one-way" id="one-way" />
						<Label htmlFor="one-way" className="cursor-pointer">
							Một chiều
						</Label>
					</div>
					<div className="flex items-center space-x-2">
						<RadioGroupItem value="round-trip" id="round-trip" />
						<Label htmlFor="round-trip" className="cursor-pointer">
							Khứ hồi
						</Label>
					</div>
				</RadioGroup>
				<span className="text-orange-600 cursor-pointer hover:underline text-sm">
					Hướng dẫn mua vé
				</span>
			</div>

			{/* Search inputs */}
			<div className="flex items-end gap-3">
				{/* Departure location */}
				<div className="flex-1 min-w-[180px]">
					<Label className="text-sm text-gray-600 mb-2 block">Điểm đi</Label>
					<Select
						value={departureLocation}
						onValueChange={setDepartureLocation}
					>
						<SelectTrigger className="h-12">
							<SelectValue placeholder="Chọn điểm đi" />
						</SelectTrigger>
						<SelectContent>
							{locations
								.filter((loc) => loc !== arrivalLocation)
								.map((loc) => (
									<SelectItem key={loc} value={loc}>
										{loc}
									</SelectItem>
								))}
						</SelectContent>
					</Select>
				</div>

				{/* Swap button */}
				<div className="flex-shrink-0 pb-1">
					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={swapLocations}
						className="rounded-full hover:bg-orange-100 h-10 w-10"
					>
						<ArrowLeftRight className="h-5 w-5 text-orange-600" />
					</Button>
				</div>

				{/* Arrival location */}
				<div className="flex-1 min-w-[180px]">
					<Label className="text-sm text-gray-600 mb-2 block">Điểm đến</Label>
					<Select value={arrivalLocation} onValueChange={setArrivalLocation}>
						<SelectTrigger className="h-12">
							<SelectValue placeholder="Chọn điểm đến" />
						</SelectTrigger>
						<SelectContent>
							{locations
								.filter((loc) => loc !== departureLocation)
								.map((loc) => (
									<SelectItem key={loc} value={loc}>
										{loc}
									</SelectItem>
								))}
						</SelectContent>
					</Select>
				</div>

				{/* Departure date */}
				<div className="w-[160px] flex-shrink-0">
					<Label className="text-sm text-gray-600 mb-2 block">Ngày đi</Label>
					<Popover>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								className={cn(
									"w-full h-12 justify-start text-left font-normal",
									!departureDate && "text-muted-foreground",
								)}
							>
								<CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
								<span className="truncate">
									{departureDate
										? format(departureDate, "dd/MM/yyyy", { locale: vi })
										: "Chọn ngày"}
								</span>
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0" align="start">
							<Calendar
								mode="single"
								selected={departureDate}
								onSelect={(date) => date && setDepartureDate(date)}
								disabled={(date) => date < new Date()}
								initialFocus
							/>
						</PopoverContent>
					</Popover>
				</div>

				{/* Return date (only for round-trip) */}
				{tripType === "round-trip" && (
					<div className="w-[160px] flex-shrink-0">
						<Label className="text-sm text-gray-600 mb-2 block">Ngày về</Label>
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									className={cn(
										"w-full h-12 justify-start text-left font-normal",
										!returnDate && "text-muted-foreground",
									)}
								>
									<CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
									<span className="truncate">
										{returnDate
											? format(returnDate, "dd/MM/yyyy", { locale: vi })
											: "Chọn ngày"}
									</span>
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0" align="start">
								<Calendar
									mode="single"
									selected={returnDate}
									onSelect={(date) => date && setReturnDate(date)}
									disabled={(date) => date < departureDate}
									initialFocus
								/>
							</PopoverContent>
						</Popover>
					</div>
				)}

				{/* Ticket count */}
				<div className="w-[100px] flex-shrink-0">
					<Label className="text-sm text-gray-600 mb-2 block">Số vé</Label>
					<Select value={ticketCount} onValueChange={setTicketCount}>
						<SelectTrigger className="h-12">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{[1, 2, 3, 4, 5].map((num) => (
								<SelectItem key={num} value={num.toString()}>
									{num}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Search button */}
			<div className="flex justify-center mt-6">
				<Button
					onClick={handleSearch}
					className="w-48 h-12 rounded-full bg-orange-600 hover:bg-orange-600/90 text-white font-semibold text-base"
				>
					Tìm chuyến
				</Button>
			</div>
		</div>
	);
}
