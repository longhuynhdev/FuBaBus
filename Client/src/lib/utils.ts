import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatVND(amount: number): string {
	return new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
	}).format(amount);
}

export function getStatusVariant(
	status: string,
): "default" | "secondary" | "destructive" | "outline" {
	switch (status) {
		case "STILL_AVAILABLE":
			return "default";
		case "FULLY_BOOKED":
			return "destructive";
		case "COMPLETED":
			return "secondary";
		default:
			return "outline";
	}
}

export function getStatusLabel(status: string): string {
	switch (status) {
		case "STILL_AVAILABLE":
			return "Còn chỗ";
		case "FULLY_BOOKED":
			return "Hết chỗ";
		case "COMPLETED":
			return "Hoàn thành";
		default:
			return status;
	}
}
