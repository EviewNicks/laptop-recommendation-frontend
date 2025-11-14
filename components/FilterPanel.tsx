'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { LaptopFilters } from '@/lib/api';

interface FilterPanelProps {
  filters: LaptopFilters;
  onFiltersChange: (filters: LaptopFilters) => void;
  className?: string;
}

interface Persona {
  id: 'mahasiswa' | 'professional' | 'gamer' | '';
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
    id: 'mahasiswa',
    name: 'Mahasiswa',
    description: 'Budget-friendly untuk studi dan produktivitas',
    icon: '🎓',
    budget_range: { min: 5000000, max: 15000000 },
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Performa baik untuk pekerjaan dan produktivitas',
    icon: '💼',
    budget_range: { min: 10000000, max: 25000000 },
  },
  {
    id: 'gamer',
    name: 'Gamer',
    description: 'High-performance untuk gaming dan entertainment',
    icon: '🎮',
    budget_range: { min: 15000000, max: 50000000 },
  },
  {
    id: '',
    name: 'Custom',
    description: 'Sesuaikan sendiri preferensi Anda',
    icon: '⚙️',
    budget_range: { min: 2000000, max: 50000000 },
  },
];

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFiltersChange,
  className = ''
}) => {
  const [selectedPersona, setSelectedPersona] = useState<Persona>(
    personas.find(p => p.id === filters.persona) || personas[3] // Default to "Custom"
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

  const handleBudgetChange = (type: 'min' | 'max', value: number[]) => {
    onFiltersChange({
      ...filters,
      [`budget_${type}`]: value[0],
    });
  };

  const handleRamChange = (value: number[]) => {
    onFiltersChange({
      ...filters,
      ram_min: value[0] > 0 ? value[0] : undefined,
    });
  };

  const clearFilters = () => {
    setSelectedPersona(personas[3]); // Set to "Custom"
    onFiltersChange({});
  };

  const activeFiltersCount = Object.values(filters).filter(value =>
    value !== undefined && value !== null && value !== ''
  ).length;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-800"
            >
              Clear All ({activeFiltersCount})
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Persona Selection */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">User Type</h3>
          <div className="grid grid-cols-2 gap-3">
            {personas.map((persona) => (
              <Button
                key={persona.id}
                variant={selectedPersona.id === persona.id ? "default" : "outline"}
                size="sm"
                className={`h-auto p-4 flex flex-col items-center justify-center space-y-2 ${
                  selectedPersona.id === persona.id
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handlePersonaSelect(persona)}
              >
                <div className="text-2xl">{persona.icon}</div>
                <div className="font-medium text-sm">{persona.name}</div>
                <div className="text-xs opacity-75">{persona.description}</div>
                {persona.id && (
                  <div className="text-xs font-medium">
                    {formatPrice(persona.budget_range.min)} - {formatPrice(persona.budget_range.max)}
                  </div>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Budget Range */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Budget Range</h3>

          {/* Min Budget */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Minimum Budget</span>
              <span className="font-medium text-gray-900">
                {formatPrice(filters.budget_min || 2000000)}
              </span>
            </div>
            <Slider
              value={[filters.budget_min || 2000000]}
              onValueChange={(value) => handleBudgetChange('min', value)}
              max={50000000}
              min={2000000}
              step={1000000}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Rp 2M</span>
              <span>Rp 50M</span>
            </div>
          </div>

          {/* Max Budget */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Maximum Budget</span>
              <span className="font-medium text-gray-900">
                {formatPrice(filters.budget_max || 50000000)}
              </span>
            </div>
            <Slider
              value={[filters.budget_max || 50000000]}
              onValueChange={(value) => handleBudgetChange('max', value)}
              max={50000000}
              min={2000000}
              step={1000000}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Rp 2M</span>
              <span>Rp 50M</span>
            </div>
          </div>
        </div>

        {/* Minimum RAM */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Minimum RAM</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Select minimum RAM requirement</span>
              <span className="font-medium text-gray-900">
                {filters.ram_min ? `${filters.ram_min}GB+` : 'No minimum'}
              </span>
            </div>
            <Slider
              value={[filters.ram_min || 0]}
              onValueChange={handleRamChange}
              max={32}
              min={0}
              step={4}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>No minimum</span>
              <span>4GB</span>
              <span>8GB</span>
              <span>16GB</span>
              <span>24GB</span>
              <span>32GB+</span>
            </div>
          </div>
        </div>

        {/* Active Filters Summary */}
        {activeFiltersCount > 0 && (
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Active Filters:</h4>
            <div className="flex flex-wrap gap-2">
              {filters.persona && (
                <Badge variant="secondary">
                  {personas.find(p => p.id === filters.persona)?.name}
                </Badge>
              )}
              {filters.budget_min && (
                <Badge variant="secondary">
                  Min: {formatPrice(filters.budget_min)}
                </Badge>
              )}
              {filters.budget_max && (
                <Badge variant="secondary">
                  Max: {formatPrice(filters.budget_max)}
                </Badge>
              )}
              {filters.ram_min && (
                <Badge variant="secondary">
                  {filters.ram_min}GB+ RAM
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FilterPanel;