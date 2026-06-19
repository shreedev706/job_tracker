interface PaginationMeta {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface PaginationProps {
  meta: PaginationMeta | null;
  onPageChange: (page: number) => void;
}

// Builds a windowed page list: 1 ... 4 5 [6] 7 8 ... 20
const getPageWindow = (
  current: number,
  total: number,
): (number | "ellipsis")[] => {
  const delta = 1; // pages shown on each side of current
  const pages: (number | "ellipsis")[] = [];

  const left = Math.max(2, current - delta);
  const right = Math.min(total - 1, current + delta);

  pages.push(1);

  if (left > 2) {
    pages.push("ellipsis");
  }

  for (let i = left; i <= right; i++) {
    pages.push(i);
  }

  if (right < total - 1) {
    pages.push("ellipsis");
  }

  if (total > 1) {
    pages.push(total);
  }

  return pages;
};

const Pagination = ({ meta, onPageChange }: PaginationProps) => {
  if (!meta || meta.totalPages <= 1) return null;

  const pageWindow = getPageWindow(meta.currentPage, meta.totalPages);

  return (
    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#111827] border border-gray-800 rounded-xl px-6 py-4 shadow-md text-sm text-gray-400">
      <div>
        Showing page{" "}
        <span className="text-white font-medium">{meta.currentPage}</span> of{" "}
        <span className="text-white font-medium">{meta.totalPages}</span> (
        {meta.totalCount} total applications)
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(meta.currentPage - 1)}
          disabled={!meta.hasPrevPage}
          className="px-3 py-1.5 bg-gray-850 border border-gray-700 rounded-md text-gray-200 hover:bg-gray-700 disabled:opacity-40 disabled:hover:bg-gray-850 transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <div className="flex items-center gap-1">
          {pageWindow.map((page, idx) =>
            page === "ellipsis" ? (
              <span
                key={`ellipsis-${idx}`}
                className="px-2 text-gray-600 select-none"
              >
                …
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                disabled={page === meta.currentPage}
                className={`min-w-[32px] px-2 py-1.5 rounded-md border transition-colors cursor-pointer ${
                  page === meta.currentPage
                    ? "bg-emerald-600 border-emerald-600 text-white cursor-default"
                    : "bg-gray-850 border-gray-700 text-gray-200 hover:bg-gray-700"
                }`}
              >
                {page}
              </button>
            ),
          )}
        </div>

        <button
          onClick={() => onPageChange(meta.currentPage + 1)}
          disabled={!meta.hasNextPage}
          className="px-3 py-1.5 bg-gray-850 border border-gray-700 rounded-md text-gray-200 hover:bg-gray-700 disabled:opacity-40 disabled:hover:bg-gray-850 transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
