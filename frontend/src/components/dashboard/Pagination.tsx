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

const Pagination = ({ meta, onPageChange }: PaginationProps) => {
  if (!meta || meta.totalPages <= 1) return null;

  return (
    <div className="w-full flex items-center justify-between bg-[#111827] border border-gray-800 rounded-xl px-6 py-4 shadow-md text-sm text-gray-400">
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
