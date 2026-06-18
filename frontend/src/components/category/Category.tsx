import React from "react";
import { categories } from "../../constants/constants";
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
  job: { filterParams: FilterParams };
}

const Category: React.FC = () => {
  const dispatch = useDispatch();
  const filterParams = useSelector((state: RootState) => state.job.filterParams);

  const executeFilterSubmit = async (paramsToSubmit: FilterParams) => {
    try {
      const { data } = await filterJobs(paramsToSubmit);
      dispatch(setSuccess(data));
      dispatch(setJobs(data));
    } catch (error) {
      console.error("Filter failed:", error);
    }
  };

  const handleChange = (name: keyof Omit<FilterParams, "page" | "limit" | "search">, value: string) => {
    const updated = { ...filterParams, page: 1, [name]: value };
    dispatch(setFilterParams(updated));
    executeFilterSubmit(updated);
  };

  const handleClear = () => {
    const defaults: FilterParams = {
      status: "all", workType: "all", sort: "latest",
      page: 1, search: "", limit: 10,
    };
    dispatch(setFilterParams(defaults));
    executeFilterSubmit(defaults);
  };

  const isDefault =
    filterParams.status === "all" &&
    filterParams.workType === "all" &&
    filterParams.sort === "latest";

  return (
    <div
      className="hidden sm:block pt-14"
      style={{ borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}
    >
      <div
        className="px-4 md:px-16 py-3 flex flex-wrap items-center gap-6"
      >
        {categories.map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            <span
              className="text-xs font-medium flex-shrink-0"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              {item.title}:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {item.options.map((option) => {
                const isActive =
                  option.optionValue === (filterParams[item.name as keyof FilterParams] ?? "");
                return (
                  <button
                    key={option.id}
                    onClick={() => handleChange(item.name as any, option.optionValue)}
                    className="px-3 py-1 rounded-full text-xs font-medium transition-all"
                    style={{
                      background: isActive ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.04)",
                      color: isActive ? "#22c55e" : "rgba(255,255,255,0.45)",
                      border: isActive
                        ? "0.5px solid rgba(34,197,94,0.35)"
                        : "0.5px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {option.optionTitle}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Clear — only shown when filters are active */}
        {!isDefault && (
          <button
            onClick={handleClear}
            className="ml-auto flex items-center gap-1.5 text-xs transition-colors"
            style={{ color: "rgba(255,255,255,0.35)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#f87171")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
};

export default Category;