import { createFileRoute } from "@tanstack/react-router";
import { BookingForm } from "@/components/booking/booking-form";
import { Header } from "@/components/layout/header";

export const Route = createFileRoute("/booking/$id")({
	component: BookingPage,
});

function BookingPage() {
	const { id } = Route.useParams();

	return (
		<div className="min-h-screen bg-gray-50">
			<Header />
			<main className="max-w-[1200px] mx-auto px-4 py-8">
				<BookingForm busId={id} />
			</main>
		</div>
	);
}
