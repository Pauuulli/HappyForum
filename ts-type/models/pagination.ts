interface Pagination {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
}

interface PaginatedData<T> {
  data: T;
  pagination: Pagination;
}

export type { PaginatedData };
