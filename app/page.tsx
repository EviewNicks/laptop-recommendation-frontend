"use client";

import { useState } from "react";
import { Laptop, LaptopFilters } from "@/lib/api";
import FilterPanel from "@/components/layout/FilterPanel";
import LaptopGrid from "@/components/layout/LaptopGrid";

export default function Home() {
  const [filters, setFilters] = useState<LaptopFilters>({});
  const [selectedLaptop, setSelectedLaptop] = useState<Laptop | null>(null);

  const handleFiltersChange = (newFilters: LaptopFilters) => {
    setFilters(newFilters);
  };

  const handleLaptopSelect = (laptop: Laptop) => {
    setSelectedLaptop(laptop);
    // Scroll to top or show laptop details modal
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Sistem Rekomendasi Laptop
              </h1>
              <p className="text-gray-600 mt-1">
                Temukan laptop terbaik sesuai kebutuhan dan budget Anda
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">
                Phase 1: Simple Filtering
              </div>
              <div className="text-xs text-gray-400">
                Fuzzy-TOPSIS Coming Soon
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Selected Laptop Detail (Mobile-friendly) */}
      {selectedLaptop && (
        <div className="bg-blue-50 border-b border-blue-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-blue-800">
                  Selected:
                </span>
                <span className="ml-2 font-semibold text-blue-900">
                  {selectedLaptop.brand} {selectedLaptop.name}
                </span>
                <span className="ml-3 text-blue-700">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(selectedLaptop.price)}
                </span>
              </div>
              <button
                onClick={() => setSelectedLaptop(null)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-80 shrink-0">
            <FilterPanel
              filters={filters}
              onFiltersChange={handleFiltersChange}
              className="lg:sticky lg:top-8"
            />
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <LaptopGrid filters={filters} onLaptopSelect={handleLaptopSelect} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Sistem Pendukung Keputusan (SPK) Laptop
            </h3>
            <p className="text-gray-600 mb-4">
              Metode Fuzzy-TOPSIS untuk rekomendasi laptop yang objektif dan
              terpersonalisasi
            </p>
            <div className="flex justify-center space-x-8 text-sm text-gray-500">
              <div>
                <span className="font-medium">Total Laptops:</span> 195+
              </div>
              <div>
                <span className="font-medium">Price Range:</span> Rp 2M - 50M
              </div>
              <div>
                <span className="font-medium">Current Phase:</span> Simple
                Filtering
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
