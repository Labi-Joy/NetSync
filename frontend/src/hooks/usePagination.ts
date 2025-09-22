'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export interface PaginationState {
  page: number;
  limit: number;
  sort: string;
  sortOrder: 'asc' | 'desc';
  search: string;
  filters: Record<string, any>;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
    startIndex: number;
    endIndex: number;
  };
  meta?: {
    query: Record<string, any>;
    sortBy: string;
    sortOrder: string;
    executionTime?: number;
    filters?: Record<string, any>;
  };
  links?: {
    self: string;
    first: string;
    last: string;
    next?: string;
    prev?: string;
  };
}

export interface UsePaginationOptions {
  initialPage?: number;
  initialLimit?: number;
  initialSort?: string;
  initialSortOrder?: 'asc' | 'desc';
  initialSearch?: string;
  initialFilters?: Record<string, any>;
  syncWithUrl?: boolean;
  debounceDelay?: number;
}

export interface UsePaginationReturn {
  // State
  state: PaginationState;
  loading: boolean;
  error: string | null;

  // Actions
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSort: (sort: string, order?: 'asc' | 'desc') => void;
  setSearch: (search: string) => void;
  setFilters: (filters: Record<string, any>) => void;
  updateFilter: (key: string, value: any) => void;
  removeFilter: (key: string) => void;
  clearFilters: () => void;
  reset: () => void;
  refresh: () => void;

  // URL sync
  getQueryParams: () => URLSearchParams;
  updateUrl: () => void;

  // Helpers
  goToFirstPage: () => void;
  goToLastPage: (totalPages: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
}

export const usePagination = (options: UsePaginationOptions = {}): UsePaginationReturn => {
  const {
    initialPage = 1,
    initialLimit = 20,
    initialSort = 'createdAt',
    initialSortOrder = 'desc',
    initialSearch = '',
    initialFilters = {},
    syncWithUrl = true,
    debounceDelay = 300
  } = options;

  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL params if syncing with URL
  const getInitialState = useCallback((): PaginationState => {
    if (syncWithUrl && searchParams) {
      return {
        page: parseInt(searchParams.get('page') || initialPage.toString()),
        limit: parseInt(searchParams.get('limit') || initialLimit.toString()),
        sort: searchParams.get('sort') || initialSort,
        sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || initialSortOrder,
        search: searchParams.get('search') || initialSearch,
        filters: {
          ...initialFilters,
          // Parse URL filters
          ...Object.fromEntries(
            Array.from(searchParams.entries())
              .filter(([key]) => !['page', 'limit', 'sort', 'sortOrder', 'search'].includes(key))
          )
        }
      };
    }

    return {
      page: initialPage,
      limit: initialLimit,
      sort: initialSort,
      sortOrder: initialSortOrder,
      search: initialSearch,
      filters: initialFilters
    };
  }, [
    syncWithUrl,
    searchParams,
    initialPage,
    initialLimit,
    initialSort,
    initialSortOrder,
    initialSearch,
    initialFilters
  ]);

  const [state, setState] = useState<PaginationState>(getInitialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounced state for search
  const [debouncedState, setDebouncedState] = useState(state);

  // Debounce search and filter changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedState(state);
    }, debounceDelay);

    return () => clearTimeout(timer);
  }, [state, debounceDelay]);

  // Update URL when state changes (if syncing enabled)
  const updateUrl = useCallback(() => {
    if (!syncWithUrl) return;

    const params = new URLSearchParams();

    // Add pagination params
    if (state.page !== 1) params.set('page', state.page.toString());
    if (state.limit !== initialLimit) params.set('limit', state.limit.toString());
    if (state.sort !== initialSort) params.set('sort', state.sort);
    if (state.sortOrder !== initialSortOrder) params.set('sortOrder', state.sortOrder);
    if (state.search) params.set('search', state.search);

    // Add filter params
    Object.entries(state.filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, value.toString());
      }
    });

    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : window.location.pathname;

    // Update URL without triggering navigation
    window.history.replaceState({}, '', newUrl);
  }, [state, syncWithUrl, initialLimit, initialSort, initialSortOrder]);

  // Actions
  const setPage = useCallback((page: number) => {
    setState(prev => ({ ...prev, page }));
  }, []);

  const setLimit = useCallback((limit: number) => {
    setState(prev => ({ ...prev, limit, page: 1 })); // Reset to first page when changing limit
  }, []);

  const setSort = useCallback((sort: string, order: 'asc' | 'desc' = 'asc') => {
    setState(prev => ({ ...prev, sort, sortOrder: order, page: 1 }));
  }, []);

  const setSearch = useCallback((search: string) => {
    setState(prev => ({ ...prev, search, page: 1 })); // Reset to first page when searching
  }, []);

  const setFilters = useCallback((filters: Record<string, any>) => {
    setState(prev => ({ ...prev, filters, page: 1 }));
  }, []);

  const updateFilter = useCallback((key: string, value: any) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, [key]: value },
      page: 1
    }));
  }, []);

  const removeFilter = useCallback((key: string) => {
    setState(prev => {
      const { [key]: removed, ...rest } = prev.filters;
      return { ...prev, filters: rest, page: 1 };
    });
  }, []);

  const clearFilters = useCallback(() => {
    setState(prev => ({ ...prev, filters: {}, page: 1 }));
  }, []);

  const reset = useCallback(() => {
    setState({
      page: initialPage,
      limit: initialLimit,
      sort: initialSort,
      sortOrder: initialSortOrder,
      search: initialSearch,
      filters: initialFilters
    });
  }, [initialPage, initialLimit, initialSort, initialSortOrder, initialSearch, initialFilters]);

  const refresh = useCallback(() => {
    // Force a re-render by updating the state
    setState(prev => ({ ...prev }));
  }, []);

  // Navigation helpers
  const goToFirstPage = useCallback(() => setPage(1), [setPage]);

  const goToLastPage = useCallback((totalPages: number) => {
    setPage(totalPages);
  }, [setPage]);

  const goToNextPage = useCallback(() => {
    setState(prev => ({ ...prev, page: prev.page + 1 }));
  }, []);

  const goToPreviousPage = useCallback(() => {
    setState(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }));
  }, []);

  // Get query params for API calls
  const getQueryParams = useCallback((): URLSearchParams => {
    const params = new URLSearchParams();

    params.set('page', debouncedState.page.toString());
    params.set('limit', debouncedState.limit.toString());
    params.set('sort', debouncedState.sort);
    params.set('sortOrder', debouncedState.sortOrder);

    if (debouncedState.search) {
      params.set('search', debouncedState.search);
    }

    Object.entries(debouncedState.filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, value.toString());
      }
    });

    return params;
  }, [debouncedState]);

  // Auto-update URL when state changes
  useEffect(() => {
    updateUrl();
  }, [updateUrl]);

  return {
    state: debouncedState,
    loading,
    error,
    setPage,
    setLimit,
    setSort,
    setSearch,
    setFilters,
    updateFilter,
    removeFilter,
    clearFilters,
    reset,
    refresh,
    getQueryParams,
    updateUrl,
    goToFirstPage,
    goToLastPage,
    goToNextPage,
    goToPreviousPage
  };
};

// Custom hook for API calls with pagination
export const usePaginatedAPI = <T>(
  apiCall: (params: URLSearchParams) => Promise<PaginationResult<T>>,
  options: UsePaginationOptions = {}
) => {
  const pagination = usePagination(options);
  const [data, setData] = useState<T[]>([]);
  const [result, setResult] = useState<PaginationResult<T> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = pagination.getQueryParams();
      const result = await apiCall(params);

      setData(result.data);
      setResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setData([]);
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, [apiCall, pagination]);

  // Fetch data when pagination state changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    ...pagination,
    data,
    result,
    loading,
    error,
    refetch: fetchData
  };
};

export default usePagination;