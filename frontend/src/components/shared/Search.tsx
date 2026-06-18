import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilterParams, setJobs, setSuccess } from "../../features/jobs/jobSlice";
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
    filterParams: FilterParams;
  };
}

const Search: React.FC = () => {
  const dispatch = useDispatch();
  const params = useSelector((state: RootState) => state.job.filterParams);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    // ✨ Fixed: Spread existing params so we don't drop status, workType, or page options!
    dispatch(
      setFilterParams({
        ...params,
        page: 1, // Reset index to page 1 on fresh search query mutations
        search: searchValue,
      })
    );
  };

  const handleSearch = async () => {
    try {
      const { data } = await filterJobs(params);
      dispatch(setSuccess(data));
      dispatch(setJobs(data));
    } catch (error) {
      console.error("Filter request matching search phrase failed:", error);
    }
    // ✨ Fixed: Removed destructive dispatch(resetSearch()) call so text remains visible
  };

  // Allow triggering searches natively by pressing the "Enter" key inside the input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex items-center w-full max-w-md bg-neutral-800 border border-neutral-700 rounded-lg focus-within:ring-2 focus-within:ring-green-500 focus-within:border-transparent transition-all overflow-hidden">
      <input
        type="search"
        name="search"
        value={params.search || ""}
        onChange={handleSearchInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Search by position (e.g. Frontend)..."
        aria-label="Search jobs"
        className="block w-full px-4 py-2.5 text-sm font-normal bg-transparent text-neutral-200 placeholder-neutral-500 outline-none"
      />

      <button
        type="button"
        onClick={handleSearch}
        aria-label="Submit search query"
        className="flex items-center justify-center px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-neutral-200 border-l border-neutral-700 transition-colors cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-5 w-5 text-neutral-300"
        >
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};

export default Search;