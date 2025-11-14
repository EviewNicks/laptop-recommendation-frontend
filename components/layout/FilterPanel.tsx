import React, { useState } from "react";
import { LaptopFilters } from "@/lib/api";

interface FilterPanelProps {
  filters: LaptopFilters;
  onFiltersChange: (filters: LaptopFilters) => void;
  className?: string;
}

interface Persona {
  id: "mahasiswa" | "professional" | "gamer" | "";
  name: string;
  description: string;
  icon: string;
  budget_range: {
    min: number;
    max: number;
  };
}

const personas: Persona[] = [
  {
    id: "mahasiswa",
    name: "Mahasiswa",
    description: "Budget-friendly untuk studi dan produktivitas",
    icon: "🎓",
    budget_range: { min: 5000000, max: 15000000 },
  },
  {
    id: "professional",
    name: "Professional",
    description: "Performa baik untuk pekerjaan dan produktivitas",
    icon: "💼",
    budget_range: { min: 10000000, max: 25000000 },
  },
  {
    id: "gamer",
    name: "Gamer",
    description: "High-performance untuk gaming dan entertainment",
    icon: "🎮",
    budget_range: { min: 15000000, max: 50000000 },
  },
  {
    id: "",
    name: "Custom",
    description: "Sesuaikan sendiri preferensi Anda",
    icon: "⚙️",
    budget_range: { min: 2000000, max: 50000000 },
  },
];

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFiltersChange,
  className = "",
}) => {
  const [selectedPersona, setSelectedPersona] = useState<Persona>(
    personas.find((p) => p.id === filters.persona) || personas[3] // Default to "Custom"
  );

  const handlePersonaSelect = (persona: Persona) => {
    setSelectedPersona(persona);
    onFiltersChange({
      ...filters,
      persona: persona.id || undefined,
      budget_min: persona.id ? persona.budget_range.min : filters.budget_min,
      budget_max: persona.id ? persona.budget_range.max : filters.budget_max,
    });
  };

  const handleBudgetChange = (type: "min" | "max", value: number) => {
    onFiltersChange({
      ...filters,
      [`budget_${type}`]: value,
    });
  };

  const handleRamChange = (value: number) => {
    onFiltersChange({
      ...filters,
      ram_min: value > 0 ? value : undefined,
    });
  };

  const clearFilters = () => {
    setSelectedPersona(personas[3]); // Set to "Custom"
    onFiltersChange({});
  };

  const activeFiltersCount = Object.values(filters).filter(
    (value) => value !== undefined && value !== null && value !== ""
  ).length;

  return (
    <div
      className={`bg-white rounded-lg shadow-md border border-gray-200 p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            Clear All ({activeFiltersCount})
          </button>
        )}
      </div>

      {/* Persona Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          User Type
        </label>
        <div className="grid grid-cols-2 gap-3">
          {personas.map((persona) => (
            <button
              key={persona.id}
              onClick={() => handlePersonaSelect(persona)}
              className={`p-3 rounded-lg border-2 transition-all ${
                selectedPersona.id === persona.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="text-2xl mb-1">{persona.icon}</div>
              <div className="font-medium text-sm text-gray-900">
                {persona.name}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {persona.description}
              </div>
              {persona.id && (
                <div className="text-xs text-blue-600 mt-2 font-medium">
                  {formatPrice(persona.budget_range.min)} -{" "}
                  {formatPrice(persona.budget_range.max)}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Budget Range */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Budget Range
        </label>

        <div className="space-y-4">
          {/* Min Budget */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Minimum Budget</span>
              <span className="text-sm font-medium text-gray-900">
                {formatPrice(filters.budget_min || 2000000)}
              </span>
            </div>
            <input
              aria-label="Minimum Budget Slider"
              type="range"
              min="2000000"
              max="50000000"
              step="1000000"
              value={filters.budget_min || 2000000}
              onChange={(e) =>
                handleBudgetChange("min", parseInt(e.target.value))
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Rp 2M</span>
              <span>Rp 50M</span>
            </div>
          </div>

          {/* Max Budget */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Maximum Budget</span>
              <span className="text-sm font-medium text-gray-900">
                {formatPrice(filters.budget_max || 50000000)}
              </span>
            </div>
            <input
              aria-label="Maximum Budget Slider"
              type="range"
              min="2000000"
              max="50000000"
              step="1000000"
              value={filters.budget_max || 50000000}
              onChange={(e) =>
                handleBudgetChange("max", parseInt(e.target.value))
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Rp 2M</span>
              <span>Rp 50M</span>
            </div>
          </div>
        </div>
      </div>

      {/* Minimum RAM */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Minimum RAM
        </label>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">
            Select minimum RAM requirement
          </span>
          <span className="text-sm font-medium text-gray-900">
            {filters.ram_min ? `${filters.ram_min}GB+` : "No minimum"}
          </span>
        </div>
        <input
          aria-label="Minimum RAM Slider"
          type="range"
          min="0"
          max="32"
          step="4"
          value={filters.ram_min || 0}
          onChange={(e) => handleRamChange(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>No minimum</span>
          <span>4GB</span>
          <span>8GB</span>
          <span>16GB</span>
          <span>24GB</span>
          <span>32GB+</span>
        </div>
      </div>

      {/* Active Filters Summary */}
      {activeFiltersCount > 0 && (
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Active Filters:
          </h4>
          <div className="flex flex-wrap gap-2">
            {filters.persona && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {personas.find((p) => p.id === filters.persona)?.name}
              </span>
            )}
            {filters.budget_min && (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Min: {formatPrice(filters.budget_min)}
              </span>
            )}
            {filters.budget_max && (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Max: {formatPrice(filters.budget_max)}
              </span>
            )}
            {filters.ram_min && (
              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                {filters.ram_min}GB+ RAM
              </span>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: #3b82f6;
          cursor: pointer;
          border-radius: 50%;
        }

        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: #3b82f6;
          cursor: pointer;
          border-radius: 50%;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default FilterPanel;
