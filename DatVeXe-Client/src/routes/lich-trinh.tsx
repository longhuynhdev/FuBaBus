import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/header";

export const Route = createFileRoute("/lich-trinh")({
  component: SchedulePage,
});

function SchedulePage() {
  return (
    <div>
      <Header />
      <main className="max-w-[1128px] mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Lich trinh</h1>
        <p className="text-muted-foreground">
          Noi dung trang lich trinh se duoc cap nhat sau.
        </p>
      </main>
    </div>
  );
}
