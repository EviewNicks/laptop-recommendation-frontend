'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api';
import { Laptop, LaptopFilters, UseLaptopsReturn } from '@/types';

const DEFAULT_FILTERS: LaptopFilters = {
  limit: 12,
  skip: 0,
};

export const useLaptops = (initialFilters: LaptopFilters = {}): UseLaptopsReturn => {
  const [laptops, setLaptops] = useState<Laptop[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<LaptopFilters>({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  });
  const [hasMore, setHasMore] = useState(true);

  const fetchLaptops = useCallback(async (newFilters?: LaptopFilters) => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const currentFilters = newFilters || filters;

      const response = await apiClient.getLaptops(currentFilters);

      if (response.success && response.data) {
        setLaptops(response.data.laptops);
        setTotalCount(response.data.total_count);
        setHasMore(response.data.laptops.length < response.data.total_count);
      } else {
        throw new Error(response.error || 'Failed to fetch laptops');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching laptops';
      setError(errorMessage);
      console.error('Error fetching laptops:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, loading]);

  const fetchLaptopById = useCallback(async (id: number): Promise<Laptop | null> => {
    try {
      const response = await apiClient.getLaptopById(id);

      if (response.success && response.data && 'laptop' in response.data) {
        return response.data.laptop;
      } else {
        throw new Error(response.error || 'Laptop not found');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching laptop details';
      setError(errorMessage);
      console.error('Error fetching laptop:', err);
      return null;
    }
  }, []);

  const refreshLaptops = useCallback(async () => {
    await fetchLaptops(filters);
  }, [fetchLaptops, filters]);

  // Initial fetch
  useEffect(() => {
    fetchLaptops(filters);
  }, []);

  return {
    laptops,
    loading,
    error,
    totalCount,
    hasMore,
    fetchLaptops,
    fetchLaptopById,
    refreshLaptops,
  };
};

export const useLaptopById = (id: number) => {
  const [laptop, setLaptop] = useState<Laptop | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLaptop = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.getLaptopById(id);

      if (response.success) {
        setLaptop(response.laptop);
      } else {
        throw new Error('Laptop not found');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching laptop details';
      setError(errorMessage);
      console.error('Error fetching laptop:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchLaptop();
  }, [fetchLaptop]);

  return { laptop, loading, error, refetch: fetchLaptop };
};

export const useLaptopStats = () => {
  const [stats, setStats] = useState({
    totalLaptops: 0,
    minPrice: 0,
    maxPrice: 0,
    avgPrice: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.getLaptopCount();

      if (response.success && response.data) {
        setStats(prev => ({
          ...prev,
          totalLaptops: response.data.total_laptops || 0,
        }));
      } else {
        throw new Error(response.error || 'Failed to fetch laptop stats');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching stats';
      setError(errorMessage);
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
};