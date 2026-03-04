import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { useState } from "react";
import bannerImage from "@/assets/banner.png";
import { BusList, type BusData } from "@/components/home/bus-list";
import {
	BusSearchForm,
	type SearchParams,
} from "@/components/home/bus-search-form";
import { Header } from "@/components/layout/header";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
	component: Index,
});

interface ApiBus {
	id: string;
	departureTime: string;
	arrivalTime: string;
	departureLocation: string;
	arrivalLocation: string;
	busType: string;
	timeType: string;
	fare: number;
	seats: { seatNumber: string; isBooked: boolean }[];
}

function formatHHmm(isoString: string): string {
	const d = new Date(isoString);
	return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}

function mapBus(bus: ApiBus): BusData {
	return {
		id: bus.id,
		departureTime: formatHHmm(bus.departureTime),
		arrivalTime: formatHHmm(bus.arrivalTime),
		departureLocation: bus.departureLocation,
		arrivalLocation: bus.arrivalLocation,
		busType: bus.busType,
		timeType: bus.timeType,
		fare: bus.fare,
		availableSeats: bus.seats.filter((s) => !s.isBooked).length,
	};
}

function Index() {
	const [showResults, setShowResults] = useState(false);
	const [buses, setBuses] = useState<BusData[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	const handleSearch = async (params: SearchParams) => {
		setShowResults(true);
		setIsLoading(true);
		try {
			const qs = new URLSearchParams({
				departureLocation: params.departureLocation,
				arrivalLocation: params.arrivalLocation,
				departureTime: format(params.departureDate, "yyyy-MM-dd"),
			});
			const response = await apiFetch(`/api/buses/search?${qs}`);
			if (response.ok) {
				const data: ApiBus[] = await response.json();
				setBuses(data.map(mapBus));
			} else {
				toast.error("Không tìm thấy chuyến xe.");
				setBuses([]);
			}
		} catch (error) {
			console.error("Search error:", error);
			toast.error("Có lỗi xảy ra khi tìm kiếm.");
			setBuses([]);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<Header />
			<main className="max-w-[1200px] mx-auto px-4 -mt-12 relative">
				{/* Banner */}
				<div className="mb-6">
					<img
						src={bannerImage}
						alt="Banner"
						className="object-cover w-full h-auto rounded-2xl"
					/>
				</div>

				{/* Search form */}
				<BusSearchForm onSearch={handleSearch} />

				{/* Results */}
				{showResults && <BusList buses={buses} isLoading={isLoading} />}
			</main>
		</div>
	);
}
