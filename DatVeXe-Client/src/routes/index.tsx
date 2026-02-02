import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/header";
import { BusSearchForm, type SearchParams } from "@/components/home/bus-search-form";
import { BusList } from "@/components/home/bus-list";

import bannerImage from "@/assets/banner.png";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (params: SearchParams) => {
    console.log("Search params:", params);
    // TODO: Call API with params
    setShowResults(true);
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
            className="w-full h-auto rounded-2xl object-cover"
          />
        </div>

        {/* Search form */}
        <BusSearchForm onSearch={handleSearch} />

        {/* Results */}
        {showResults && <BusList />}
      </main>
    </div>
  );
}
