import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/header";
import { MenuGroup } from "@/components/user/menu-group";

export const Route = createFileRoute("/ticket-purchase-history")({
	component: TicketHistoryPage,
});

function TicketHistoryPage() {
	return (
		<div className="min-h-screen">
			<Header />
			<main className="max-w-[1128px] mx-auto px-4 mt-6 relative">
				<div className="flex p-6 bg-white border border-gray-200 gap-6 rounded-2xl">
					<div className="w-[280px] flex-shrink-0">
						<MenuGroup />
					</div>
					<div className="flex-1">
						<h1 className="mb-2 text-2xl font-medium text-gray-900">
							Lịch sử mua vé
						</h1>
						<p className="text-base text-gray-700/80">
							Xem lại các vé đã mua trước đây
						</p>
						<div className="p-6 mt-6 text-center border border-gray-300 rounded-2xl text-muted-foreground">
							Chưa có lịch sử mua vé
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
