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
      <main className="max-w-[1128px] mx-auto px-4 -mt-20 relative">
        <div className="flex gap-6 bg-white rounded-2xl border border-gray-200 p-6">
          <div className="w-[280px] flex-shrink-0">
            <MenuGroup />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-medium text-gray-900 mb-2">
              Lịch sử mua vé
            </h1>
            <p className="text-base text-gray-700/80">
              Xem lại các vé đã mua trước đây
            </p>
            <div className="mt-6 p-6 rounded-2xl border border-gray-300 text-center text-muted-foreground">
              Chưa có lịch sử mua vé
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
