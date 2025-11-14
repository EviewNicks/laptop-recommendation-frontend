/**
 * Re-export types from main API library to avoid duplicates
 * Additional app-specific types are defined here
 */

// Re-export core types from the main API library
export type {
  Laptop,
  LaptopFilters,
  LaptopResponse,
  ApiResponse,
  LoadingState,
  PaginationState
} from '@/lib/api';

// Import types for use in this file
import type {
  Laptop as LaptopType,
  LaptopFilters as LaptopFiltersType
} from '@/lib/api';

// App-specific types
export interface Persona {
  id: string;
  name: string;
  description: string;
  icon: string;
  priorities: string[];
  budget_range: {
    min: number;
    max: number;
  };
}

export interface RecommendationRequest {
  budget_min: number;
  budget_max: number;
  persona?: string;
  preferences?: {
    processor?: number;
    ram?: number;
    storage?: number;
    gpu?: number;
    display?: number;
  };
}

// UI Component Types (legacy, can be removed if not needed)
export interface ButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  error?: string;
  label?: string;
  required?: boolean;
  className?: string;
}

export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
  fullScreen?: boolean;
}

export interface ErrorMessageProps {
  variant?: "default" | "destructive" | "warning" | "info" | "success";
  message: string;
  onDismiss?: () => void;
  onRetry?: () => void;
  className?: string;
}

// Hook Types
export interface UseFiltersReturn {
  filters: LaptopFiltersType;
  updateFilters: (filters: Partial<LaptopFiltersType>) => void;
  updateFilter?: (key: string, value: any) => void;
  clearFilters: () => void;
  activeFiltersCount: number;
}

export interface UseLaptopsReturn {
  laptops: LaptopType[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  hasMore?: boolean;
  fetchLaptops: (filters?: LaptopFiltersType) => Promise<void>;
  fetchLaptopById: (id: number) => Promise<LaptopType | null>;
  refreshLaptops: () => Promise<void>;
}
