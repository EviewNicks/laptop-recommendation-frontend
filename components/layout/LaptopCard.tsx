import React from "react";
import { Laptop } from "@/lib/api";

interface LaptopCardProps {
  laptop: Laptop;
  onClick?: (laptop: Laptop) => void;
  className?: string;
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const getDisplaySizeLabel = (size: number): string => {
  if (size >= 17) return `${size}" (Large)`;
  if (size >= 15) return `${size}" (Standard)`;
  return `${size}" (Compact)`;
};

const getPerformanceLevel = (laptop: Laptop): "high" | "medium" | "entry" => {
  // Simple performance classification based on price and specs
  if (laptop.price > 15000000 || laptop.gpu_name.includes("RTX")) return "high";
  if (laptop.price > 8000000) return "medium";
  return "entry";
};

const LaptopCard: React.FC<LaptopCardProps> = ({
  laptop,
  onClick,
  className = "",
}) => {
  const performanceLevel = getPerformanceLevel(laptop);

  const performanceColors = {
    high: "bg-green-100 text-green-800 border-green-200",
    medium: "bg-blue-100 text-blue-800 border-blue-200",
    entry: "bg-gray-100 text-gray-800 border-gray-200",
  };

  const performanceLabels = {
    high: "High Performance",
    medium: "Medium Performance",
    entry: "Entry Level",
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md border border-gray-200 p-4 hover:shadow-lg transition-shadow duration-200 cursor-pointer ${className}`}
      onClick={() => onClick?.(laptop)}
    >
      {/* Header with Brand and Performance Badge */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-lg text-gray-900">{laptop.brand}</h3>
          <p
            className="text-sm text-gray-600 font-medium truncate max-w-[200px]"
            title={laptop.name}
          >
            {laptop.name}
          </p>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium border ${performanceColors[performanceLevel]}`}
        >
          {performanceLabels[performanceLevel]}
        </span>
      </div>

      {/* Price - Prominent Display */}
      <div className="mb-4">
        <p className="text-2xl font-bold text-blue-600">
          {formatPrice(laptop.price)}
        </p>
      </div>

      {/* Specifications Grid */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Processor:</span>
          <span
            className="font-medium text-gray-900 text-right max-w-[140px]"
            title={laptop.processor_name}
          >
            {laptop.processor_name.length > 25
              ? `${laptop.processor_name.substring(0, 25)}...`
              : laptop.processor_name}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">RAM:</span>
          <span className="font-medium text-gray-900">{laptop.ram}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Storage:</span>
          <span className="font-medium text-gray-900">{laptop.storage}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Display:</span>
          <span className="font-medium text-gray-900">
            {getDisplaySizeLabel(laptop.display_size)}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">GPU:</span>
          <span
            className="font-medium text-gray-900 text-right max-w-[120px]"
            title={laptop.gpu_name}
          >
            {laptop.gpu_name.length > 20
              ? `${laptop.gpu_name.substring(0, 20)}...`
              : laptop.gpu_name}
          </span>
        </div>
      </div>

      {/* Laptop ID for reference */}
      <div className="text-xs text-gray-400 border-t pt-2">
        ID: #{laptop.id}
      </div>
    </div>
  );
};

export default LaptopCard;
