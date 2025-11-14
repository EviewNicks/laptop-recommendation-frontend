'use client';

import { useState, useCallback } from 'react';
import { LaptopFilters, UseFiltersReturn, Persona } from '@/types';

const DEFAULT_FILTERS: LaptopFilters = {
  budget_min: 2000000,
  budget_max: 50000000,
  limit: 12,
  skip: 0,
};

export const useFilters = (initialFilters: Partial<LaptopFilters> = {}): UseFiltersReturn => {
  const [filters, setFilters] = useState<LaptopFilters>({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  });

  const updateFilter = useCallback((key: string, value: any) => {
    setFilters(prev => {
      // Reset pagination when filters change (except for skip/limit)
      const shouldResetPagination = !['skip', 'limit'].includes(key);

      return {
        ...prev,
        [key]: value,
        ...(shouldResetPagination && { skip: 0 }),
      };
    });
  }, []);

  const updateFilters = useCallback((newFilters: Partial<LaptopFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      skip: 0, // Reset pagination when filters change
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      ...DEFAULT_FILTERS,
      ...initialFilters,
    });
  }, [initialFilters]);

  const activeFiltersCount = Object.values(filters).filter(value =>
    value !== undefined && value !== null && value !== ''
  ).length;

  return {
    filters,
    updateFilter,
    updateFilters,
    clearFilters,
    activeFiltersCount,
  };
};

export const useBudgetFilter = (
  initialBudget: { min?: number; max?: number } = {}
) => {
  const [budget, setBudget] = useState({
    min: initialBudget.min || DEFAULT_FILTERS.budget_min!,
    max: initialBudget.max || DEFAULT_FILTERS.budget_max!,
  });

  const updateBudget = useCallback((newBudget: { min?: number; max?: number }) => {
    setBudget(prev => ({
      min: newBudget.min ?? prev.min,
      max: newBudget.max ?? prev.max,
    }));
  }, []);

  const validateBudget = useCallback(() => {
    return budget.min <= budget.max &&
           budget.min >= DEFAULT_FILTERS.budget_min! &&
           budget.max <= DEFAULT_FILTERS.budget_max!;
  }, [budget]);

  const formatBudget = useCallback((value: number) => {
    return `Rp ${(value / 1000000).toFixed(0)}JT`;
  }, []);

  return {
    budget,
    updateBudget,
    validateBudget,
    formatBudget,
  };
};

export const usePersonaFilter = (initialPersona?: Persona) => {
  const [persona, setPersona] = useState<Persona | undefined>(initialPersona);

  const personas = [
    {
      value: 'mahasiswa' as unknown as Persona,
      label: 'Mahasiswa',
      description: 'Untuk kebutuhan belajar dan tugas',
      icon: '🎓',
      recommendedBudget: { min: 5000000, max: 15000000 },
      priorityFeatures: ['RAM', 'Storage', 'Price'],
    },
    {
      value: 'professional' as unknown as Persona,
      label: 'Professional',
      description: 'Untuk kerja dan produktivitas',
      icon: '💼',
      recommendedBudget: { min: 10000000, max: 30000000 },
      priorityFeatures: ['Processor', 'RAM', 'Display'],
    },
    {
      value: 'gamer' as unknown as Persona,
      label: 'Gamer',
      description: 'Untuk gaming dan hiburan',
      icon: '🎮',
      recommendedBudget: { min: 15000000, max: 50000000 },
      priorityFeatures: ['GPU', 'Processor', 'Display'],
    },
  ];

  const updatePersona = useCallback((newPersona: Persona) => {
    setPersona(newPersona);
  }, []);

  const getPersonaRecommendations = useCallback((selectedPersona: Persona) => {
    return personas.find(p => p.value === selectedPersona);
  }, [personas]);

  return {
    persona,
    personas,
    updatePersona,
    getPersonaRecommendations,
  };
};