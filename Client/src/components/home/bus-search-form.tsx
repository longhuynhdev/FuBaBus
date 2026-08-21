import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { ArrowLeftRight } from "lucide-react";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
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

export function BusSearchForm({ onSearch }: BusSearchFormProps) {
	const [tripType, setTripType] = useState<"one-way" | "round-trip">("one-way");
	const [departureLocation, setDepartureLocation] = useState("");
	const [arrivalLocation, setArrivalLocation] = useState("");
	const [departureDate, setDepartureDate] = useState<Date>(new Date());
	const [returnDate, setReturnDate] = useState<Date>(new Date());
	const [ticketCount, setTicketCount] = useState("1");
	const [locations, setLocations] = useState<string[]>([]);

	useEffect(() => {
		apiFetch("/api/buses")
			.then((res) => (res.ok ? res.json() : { content: [] }))
			.then(
				(data: {
					content: { departureLocation: string; arrivalLocation: string }[];
				}) => {
					const buses = data.content ?? [];
					const unique = [
						...new Set([
							...buses.map((b) => b.departureLocation),
							...buses.map((b) => b.arrivalLocation),
						]),
					];
					setLocations(unique);
				},
			)
			.catch(() => {});
	}, []);

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
		<div className="p-4 sm:p-6 bg-white border border-gray-200 shadow-lg rounded-2xl">
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
				<span className="text-sm text-orange-600 cursor-pointer hover:underline">
					Hướng dẫn mua vé
				</span>
			</div>

			{/* Search inputs — stacks vertically on mobile, row on lg+ */}
			<div className="flex flex-wrap items-end gap-3">
				{/* Departure location */}
				<div className="w-full sm:flex-1 sm:min-w-0">
					<Label className="block mb-2 text-sm text-gray-600">Điểm đi</Label>
					<Select
						value={departureLocation}
						onValueChange={setDepartureLocation}
					>
						<SelectTrigger className="w-full data-[size=default]:h-16 text-base">
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
				<div className="flex-shrink-0 flex flex-col items-center w-full sm:w-auto">
					<span className="invisible hidden sm:block mb-2 text-sm">‎</span>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={swapLocations}
						className="h-10 w-10 sm:h-16 rounded-lg hover:bg-orange-100"
					>
						<ArrowLeftRight className="w-5 h-5 text-orange-600 rotate-90 sm:rotate-0" />
					</Button>
				</div>

				{/* Arrival location */}
				<div className="w-full sm:flex-1 sm:min-w-0">
					<Label className="block mb-2 text-sm text-gray-600">Điểm đến</Label>
					<Select value={arrivalLocation} onValueChange={setArrivalLocation}>
						<SelectTrigger className="w-full data-[size=default]:h-16 text-base">
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
				<div className="w-full sm:w-[200px] sm:flex-shrink-0">
					<Label className="block mb-2 text-sm text-gray-600">Ngày đi</Label>
					<Popover>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								className={cn(
									"w-full h-16 flex-col items-start justify-center px-4 font-normal gap-0.5",
									!departureDate && "text-muted-foreground",
								)}
							>
								<span className="text-base font-medium leading-tight">
									{departureDate
										? format(departureDate, "dd/MM/yyyy", { locale: vi })
										: "Chọn ngày"}
								</span>
								{departureDate && (
									<span className="text-xs text-gray-400 leading-tight capitalize">
										{format(departureDate, "EEEE", { locale: vi })}
									</span>
								)}
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
					<div className="w-full sm:w-[200px] sm:flex-shrink-0">
						<Label className="block mb-2 text-sm text-gray-600">Ngày về</Label>
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									className={cn(
										"w-full h-16 flex-col items-start justify-center px-4 font-normal gap-0.5",
										!returnDate && "text-muted-foreground",
									)}
								>
									<span className="text-base font-medium leading-tight">
										{returnDate
											? format(returnDate, "dd/MM/yyyy", { locale: vi })
											: "Chọn ngày"}
									</span>
									{returnDate && (
										<span className="text-xs text-gray-400 leading-tight capitalize">
											{format(returnDate, "EEEE", { locale: vi })}
										</span>
									)}
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
				<div className="w-full sm:w-[110px] sm:flex-shrink-0">
					<Label className="block mb-2 text-sm text-gray-600">Số vé</Label>
					<Select value={ticketCount} onValueChange={setTicketCount}>
						<SelectTrigger className="w-full data-[size=default]:h-16 text-base">
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
					className="w-48 h-12 text-base font-semibold text-white bg-orange-600 rounded-full hover:bg-orange-600/90"
				>
					Tìm chuyến
				</Button>
			</div>
		</div>
	);
}
