/**
 * API Client for Laptop Recommendation System
 * Handles communication with FastAPI backend
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export interface Laptop {
  id: number;
  brand: string;
  name: string;
  price: number;
  ram: string;
  storage: string;
  display_size: number;
  processor_name: string;
  gpu_name: string;
}

export interface LaptopFilters {
  budget_min?: number;
  budget_max?: number;
  persona?: "mahasiswa" | "professional" | "gamer";
  processor?: string;
  ram_min?: number;
  skip?: number;
  limit?: number;
}

export interface LaptopResponse {
  success: boolean;
  laptops: Laptop[];
  total_count: number;
  skip: number;
  limit: number;
  filters_applied: {
    budget_min?: number;
    budget_max?: number;
    persona?: string;
    processor?: string;
    ram_min?: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data as T,
      };
    } catch (error) {
      console.error("API request failed:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Get laptops with optional filters
   */
  async getLaptops(
    filters: LaptopFilters = {}
  ): Promise<ApiResponse<LaptopResponse>> {
    const params = new URLSearchParams();

    // Add filters to query params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const queryString = params.toString();
    const endpoint = `/api/laptops${queryString ? `?${queryString}` : ""}`;

    return this.request<LaptopResponse>(endpoint);
  }

  /**
   * Get laptop details by ID
   */
  async getLaptopById(id: number): Promise<ApiResponse<{ laptop: Laptop }>> {
    return this.request<{ laptop: Laptop }>(`/api/laptops/${id}`);
  }

  /**
   * Get total laptop count
   */
  async getLaptopCount(): Promise<ApiResponse<{ total_laptops: number }>> {
    return this.request<{ total_laptops: number }>("/api/laptops/stats/count");
  }

  /**
   * Get recommendations based on user preferences
   */
  async getRecommendations(
    budget_min: number,
    budget_max: number,
    persona?: string,
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    preferences?: Record<string, any>
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    const params = new URLSearchParams({
      budget_min: budget_min.toString(),
      budget_max: budget_max.toString(),
    });

    if (persona) {
      params.append("persona", persona);
    }

    if (preferences) {
      Object.entries(preferences).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const queryString = params.toString();
    const endpoint = `/api/recommendations${
      queryString ? `?${queryString}` : ""
    }`;

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.request<any>(endpoint);
  }

  /**
   * Get available processors
   */
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getProcessors(): Promise<any> {
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.request<any>("/api/processors");
  }

  /**
   * Test API connection
   */
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  async testConnection(): Promise<ApiResponse<any>> {
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.request<any>("/health");
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Export convenience functions
export const {
  getLaptops,
  getLaptopById,
  getLaptopCount,
  getRecommendations,
  getProcessors,
  testConnection,
} = apiClient;

export default apiClient;
