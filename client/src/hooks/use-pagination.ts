import { useState } from "react";

export interface PaginationProps {
  itemsPerPage?: number;
  totalItems: number;
}

export function usePagination({ itemsPerPage = 10, totalItems }: PaginationProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const nextPage = () => {
    setCurrentPage((old) => Math.min(old + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage((old) => Math.max(old - 1, 1));
  };

  const goToPage = (pageNumber: number) => {
    const page = Math.max(1, Math.min(pageNumber, totalPages));
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return {
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
    startIndex,
    endIndex,
    itemsPerPage,
  };
}
