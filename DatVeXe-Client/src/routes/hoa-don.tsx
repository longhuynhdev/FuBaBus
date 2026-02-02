import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/header";
import { InvoiceLookup } from "@/components/lookup/invoice-lookup";

export const Route = createFileRoute("/hoa-don")({
  component: InvoicePage,
});

function InvoicePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-[1128px] mx-auto px-4 -mt-20 relative">
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <InvoiceLookup />
        </div>
      </main>
    </div>
  );
}
