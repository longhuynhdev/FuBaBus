import { useState } from "react";
import { cn } from "@/lib/utils";

interface Seat {
	seatNumber: string;
	isBooked: boolean;
}

interface SeatSelectorProps {
	seats: Seat[];
	maxSeats?: number;
	onSelectionChange: (selectedSeats: string[]) => void;
}

export function SeatSelector({
	seats,
	maxSeats = 5,
	onSelectionChange,
}: SeatSelectorProps) {
	const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

	const toggleSeat = (seatNumber: string) => {
		let newSelection: string[];

		if (selectedSeats.includes(seatNumber)) {
			newSelection = selectedSeats.filter((s) => s !== seatNumber);
		} else {
			if (selectedSeats.length >= maxSeats) {
				return; // Max seats reached
			}
			newSelection = [...selectedSeats, seatNumber];
		}

		setSelectedSeats(newSelection);
		onSelectionChange(newSelection);
	};

	return (
		<div>
			<h3 className="mb-4 text-lg font-semibold">Chọn ghế</h3>

			<div className="flex gap-8">
				{/* Seat grid */}
				<div className="flex-1">
					<div className="grid grid-cols-4 gap-3 max-w-[300px]">
						{seats.map((seat) => {
							const isSelected = selectedSeats.includes(seat.seatNumber);
							const isBooked = seat.isBooked;

							return (
								<button
									key={seat.seatNumber}
									disabled={isBooked}
									onClick={() => !isBooked && toggleSeat(seat.seatNumber)}
									className={cn(
										"relative w-16 h-16 rounded-lg border-2 transition-all flex flex-col items-center justify-center",
										isBooked &&
											"bg-gray-200 border-gray-300 cursor-not-allowed opacity-60",
										!isBooked &&
											!isSelected &&
											"bg-blue-50 border-blue-300 hover:border-blue-500 cursor-pointer",
										isSelected &&
											"bg-orange-100 border-orange-500 cursor-pointer",
									)}
								>
									{/* Seat icon */}
									<div
										className={cn(
											"w-8 h-6 rounded-t-lg mb-1",
											isBooked && "bg-gray-400",
											!isBooked && !isSelected && "bg-blue-400",
											isSelected && "bg-orange-500",
										)}
									/>
									<span
										className={cn(
											"text-xs font-medium",
											isBooked && "text-gray-500",
											!isBooked && !isSelected && "text-blue-700",
											isSelected && "text-orange-700",
										)}
									>
										{seat.seatNumber}
									</span>
								</button>
							);
						})}
					</div>
				</div>

				{/* Legend */}
				<div className="flex flex-col gap-3">
					<div className="flex items-center gap-2">
						<div className="w-6 h-6 bg-gray-300 rounded" />
						<span className="text-sm text-gray-600">Đã bán</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-6 h-6 bg-blue-400 rounded" />
						<span className="text-sm text-gray-600">Còn trống</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-6 h-6 bg-orange-500 rounded" />
						<span className="text-sm text-gray-600">Đang chọn</span>
					</div>
				</div>
			</div>

			{selectedSeats.length > 0 && (
				<div className="p-3 mt-4 rounded-lg bg-orange-50">
					<span className="text-sm text-gray-600">Ghế đã chọn: </span>
					<span className="font-medium text-orange-600">
						{selectedSeats.join(", ")}
					</span>
					<span className="ml-2 text-sm text-gray-500">
						({selectedSeats.length}/{maxSeats} ghế)
					</span>
				</div>
			)}
		</div>
	);
}
