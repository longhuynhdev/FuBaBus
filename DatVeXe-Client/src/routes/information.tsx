import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/header";
import { InformationForm } from "@/components/user/information-form";
import { MenuGroup } from "@/components/user/menu-group";

export const Route = createFileRoute("/information")({
	component: InformationPage,
});

function InformationPage() {
	return (
		<div className="min-h-screen">
			<Header />
			<main className="max-w-[1128px] mx-auto px-4 -mt-20 relative">
				<div className="flex gap-6 bg-white rounded-2xl border border-gray-200 p-6">
					{/* Sidebar */}
					<div className="w-[280px] flex-shrink-0">
						<MenuGroup />
					</div>

					{/* Main content */}
					<InformationForm />
				</div>
			</main>
		</div>
	);
}
