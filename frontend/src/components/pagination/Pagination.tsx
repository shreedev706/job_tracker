import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setJobs, setSuccess, setFilterParams } from "../../features/jobs/jobSlice";
import { filterJobs } from "../../http/http";

interface FilterParams {
  status: string;
  workType: string;
  sort: string;
  search: string;
  page: number;
  limit: number;
}

interface RootState {
  job: {
    totalJobs: number;
    filterParams: FilterParams;
  };
}

const Pagination: React.FC = () => {
  const dispatch = useDispatch();
  const totalJobs = useSelector((state: RootState) => state.job.totalJobs);
  const params = useSelector((state: RootState) => state.job.filterParams);
  
  // Single source of truth for the active index derived straight from Redux parameters
  const currentActivePage = params.page || 1;
  const limitPerPage = params.limit || 10;
  const totalPages = Math.ceil(totalJobs / limitPerPage) || 1;

  const fetchJobs = async (paramsToSubmit: FilterParams) => {
    try {
      const { data } = await filterJobs(paramsToSubmit);
      dispatch(setSuccess(data));
      dispatch(setJobs(data));
    } catch (error) {
      console.error("Pagination data dispatch fetching failed:", error);
    }
  };

  const selectPageHandler = (page: number) => {
    if (page === currentActivePage) return;

    const updatedParams = { ...params, page };
    dispatch(setFilterParams(updatedParams));
    fetchJobs(updatedParams);
  };

  const handlePrevious = () => {
    if (currentActivePage > 1) {
      selectPageHandler(currentActivePage - 1);
    }
  };

  const handleNext = () => {
    if (currentActivePage < totalPages) {
      selectPageHandler(currentActivePage + 1);
    }
  };

  return (
    <div className="flex items-center justify-center gap-2 md:gap-4 py-6 select-none">
      {/* Previous Action Button */}
      <button
        disabled={currentActivePage === 1}
        className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-neutral-400 uppercase transition-all rounded-lg hover:bg-neutral-800 active:bg-neutral-800 disabled:pointer-events-none disabled:opacity-40 cursor-pointer text-center tracking-wider"
        type="button"
        onClick={handlePrevious}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2.5"
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        <span>Prev</span>
      </button>

      {/* Numerical Sequence List Map */}
      <div className="flex items-center gap-1.5">
        {[...Array(totalPages)].map((_, i) => {
          const pageNumber = i + 1;
          const isActive = currentActivePage === pageNumber;

          return (
            <button
              key={pageNumber}
              type="button"
              onClick={() => selectPageHandler(pageNumber)}
              className={`relative min-w-[36px] h-[36px] flex items-center justify-center rounded-lg text-sm font-semibold transition-all duration-200 border cursor-pointer ${
                isActive
                  ? "bg-green-600 border-transparent text-white shadow-md shadow-green-900/20"
                  : "bg-transparent border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200"
              }`}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>

      {/* Next Action Button */}
      <button
        disabled={currentActivePage === totalPages}
        className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-neutral-400 uppercase transition-all rounded-lg hover:bg-neutral-800 active:bg-neutral-800 disabled:pointer-events-none disabled:opacity-40 cursor-pointer text-center tracking-wider"
        type="button"
        onClick={handleNext}
      >
        <span>Next</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2.5"
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </button>
    </div>
  );
};

export default Pagination;