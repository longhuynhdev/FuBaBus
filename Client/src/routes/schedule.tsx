import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/header";

export const Route = createFileRoute("/schedule")({
	component: SchedulePage,
});

function SchedulePage() {
	return (
		<div>
			<Header />
			<main className="max-w-[1128px] mx-auto px-4 py-8"></main>
		</div>
	);
}
