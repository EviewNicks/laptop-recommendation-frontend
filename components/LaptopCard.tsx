'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { Laptop } from '@/lib/api';

interface LaptopCardProps {
  laptop: Laptop;
  onClick?: (laptop: Laptop) => void;
  className?: string;
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const getDisplaySizeLabel = (size: number): string => {
  if (size >= 17) return `${size}" (Large)`;
  if (size >= 15) return `${size}" (Standard)`;
  return `${size}" (Compact)`;
};

const getPerformanceLevel = (laptop: Laptop): 'high' | 'medium' | 'entry' => {
  if (laptop.price > 15000000 || laptop.gpu_name.includes('RTX')) return 'high';
  if (laptop.price > 8000000) return 'medium';
  return 'entry';
};

const getPerformanceBadgeVariant = (level: 'high' | 'medium' | 'entry'): "default" | "secondary" | "destructive" | "outline" => {
  switch (level) {
    case 'high': return 'default';
    case 'medium': return 'secondary';
    case 'entry': return 'outline';
    default: return 'outline';
  }
};

const LaptopCard: React.FC<LaptopCardProps> = ({
  laptop,
  onClick,
  className = ''
}) => {
  const performanceLevel = getPerformanceLevel(laptop);
  const performanceLabels = {
    high: 'High Performance',
    medium: 'Medium Performance',
    entry: 'Entry Level',
  };

  return (
    <Card
      className={`hover:shadow-lg transition-all duration-200 cursor-pointer group ${className}`}
      onClick={() => onClick?.(laptop)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {laptop.brand}
            </CardTitle>
            <p className="text-sm text-gray-600 font-medium leading-tight line-clamp-2 mt-1" title={laptop.name}>
              {laptop.name}
            </p>
          </div>
          <Badge
            variant={getPerformanceBadgeVariant(performanceLevel)}
            className="ml-2 flex-shrink-0"
          >
            {performanceLabels[performanceLevel]}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Price - Prominent Display */}
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">
            {formatPrice(laptop.price)}
          </p>
        </div>

        {/* Specifications Grid */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Processor:</span>
            <span
              className="text-gray-900 text-right max-w-[140px] truncate"
              title={laptop.processor_name}
            >
              {laptop.processor_name.length > 25
                ? `${laptop.processor_name.substring(0, 25)}...`
                : laptop.processor_name
              }
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">RAM:</span>
            <span className="text-gray-900 font-medium">{laptop.ram}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Storage:</span>
            <span className="text-gray-900 font-medium">{laptop.storage}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Display:</span>
            <span className="text-gray-900 font-medium">
              {getDisplaySizeLabel(laptop.display_size)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">GPU:</span>
            <span
              className="text-gray-900 text-right max-w-[120px] truncate"
              title={laptop.gpu_name}
            >
              {laptop.gpu_name.length > 20
                ? `${laptop.gpu_name.substring(0, 20)}...`
                : laptop.gpu_name
              }
            </span>
          </div>
        </div>

        {/* Laptop ID for reference */}
        <div className="pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-400">
            ID: #{laptop.id}
          </div>
        </div>

        {/* Action Button */}
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-4 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onClick?.(laptop);
          }}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default LaptopCard;