import React, { useState, useEffect } from "react";
import { apiClient, Laptop, LaptopFilters } from "@/lib/api";
import { LoadingState } from "@/lib/api";
import LaptopCard from "./LaptopCard";

interface LaptopGridProps {
  filters?: LaptopFilters;
  onLaptopSelect?: (laptop: Laptop) => void;
  className?: string;
}

interface GridState {
  laptops: Laptop[];
  loadingState: LoadingState;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

const ITEMS_PER_PAGE = 12;

const LaptopGrid: React.FC<LaptopGridProps> = ({
  filters = {},
  onLaptopSelect,
  className = "",
}) => {
  const [gridState, setGridState] = useState<GridState>({
    laptops: [],
    loadingState: {
      isLoading: false,
      error: null,
      lastUpdated: null,
    },
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: ITEMS_PER_PAGE,
    },
  });

  const fetchLaptops = async (
    page: number = 1,
    currentFilters: LaptopFilters = {}
  ) => {
    setGridState((prev) => ({
      ...prev,
      loadingState: {
        ...prev.loadingState,
        isLoading: true,
        error: null,
      },
    }));

    try {
      const response = await apiClient.getLaptops({
        ...currentFilters,
        skip: (page - 1) * ITEMS_PER_PAGE,
        limit: ITEMS_PER_PAGE,
      });

      if (response.success && response.data) {
        const totalPages = Math.ceil(
          response.data.total_count / ITEMS_PER_PAGE
        );

        setGridState((prev) => ({
          laptops: response.data!.laptops,
          loadingState: {
            isLoading: false,
            error: null,
            lastUpdated: new Date(),
          },
          pagination: {
            currentPage: page,
            totalPages,
            totalItems: response.data!.total_count,
            itemsPerPage: ITEMS_PER_PAGE,
          },
        }));
      } else {
        throw new Error(response.error || "Failed to fetch laptops");
      }
    } catch (error) {
      setGridState((prev) => ({
        ...prev,
        loadingState: {
          isLoading: false,
          error:
            error instanceof Error ? error.message : "Failed to load laptops",
          lastUpdated: null,
        },
      }));
    }
  };

  // Fetch laptops when component mounts or filters change
  useEffect(() => {
    fetchLaptops(1, filters);
  }, [
    filters.budget_min,
    filters.budget_max,
    filters.persona,
    filters.processor,
    filters.ram_min,
  ]);

  const handlePageChange = (page: number) => {
    fetchLaptops(page, filters);
  };

  const handleLaptopClick = (laptop: Laptop) => {
    onLaptopSelect?.(laptop);
  };

  const renderPagination = () => {
    const { currentPage, totalPages, totalItems } = gridState.pagination;

    if (totalPages <= 1) return null;

    return (
      <div className="flex flex-col items-center space-y-4 mt-8">
        <div className="text-sm text-gray-600">
          Showing {gridState.laptops.length} of {totalItems} laptops
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-1 rounded border text-sm font-medium ${
                    currentPage === pageNum
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  if (gridState.loadingState.isLoading) {
    return (
      <div
        className={`flex items-center justify-center min-h-[400px] ${className}`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading laptops...</p>
        </div>
      </div>
    );
  }

  if (gridState.loadingState.error) {
    return (
      <div
        className={`flex items-center justify-center min-h-[400px] ${className}`}
      >
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg
              className="h-12 w-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Error Loading Laptops
          </h3>
          <p className="text-gray-600 mb-4">{gridState.loadingState.error}</p>
          <button
            onClick={() => fetchLaptops(1, filters)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (gridState.laptops.length === 0) {
    return (
      <div
        className={`flex items-center justify-center min-h-[400px] ${className}`}
      >
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <svg
              className="h-12 w-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Laptops Found
          </h3>
          <p className="text-gray-600">
            Try adjusting your filters to see more results.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Results Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Available Laptops
        </h2>
        <p className="text-gray-600">
          Found {gridState.pagination.totalItems} laptops matching your criteria
        </p>
      </div>

      {/* Laptop Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {gridState.laptops.map((laptop) => (
          <LaptopCard
            key={laptop.id}
            laptop={laptop}
            onClick={handleLaptopClick}
            className="h-full"
          />
        ))}
      </div>

      {/* Pagination */}
      {renderPagination()}
    </div>
  );
};

export default LaptopGrid;
