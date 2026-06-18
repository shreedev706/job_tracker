import React from "react";
import { categories } from "../../constants/constants";
import { Button } from "../shared";
import { useDispatch, useSelector } from "react-redux";
import { setJobs, setSuccess, setFilterParams } from "../../features/jobs/jobSlice";
import { filterJobs, logout } from "../../http/http";
import { setAuth } from "../../features/user/userSlice";

// 1. Explicit props interface for container layout toggles
interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

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

const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const filterParams = useSelector((state: RootState) => state.job.filterParams);

  // 2. Streamlined API filter pipeline
  const executeFilterSubmit = async (paramsToSubmit: FilterParams) => {
    try {
      const { data } = await filterJobs(paramsToSubmit);
      dispatch(setSuccess(data));
      dispatch(setJobs(data));
    } catch (error) {
      console.error("Mobile drawer filter execution failed:", error);
    } finally {
      onClose(); // Automatically close side tray on execution complete
    }
  };

  const handleChange = (name: keyof Omit<FilterParams, "page" | "limit" | "search">, value: string) => {
    const updatedFilterParams = {
      ...filterParams,
      page: 1,
      [name]: value,
    };
    dispatch(setFilterParams(updatedFilterParams));
    executeFilterSubmit(updatedFilterParams);
  };

  const handleClear = () => {
    const defaultParams: FilterParams = {
      status: "all",
      workType: "all",
      sort: "latest",
      page: 1,
      search: "",
      limit: 10,
    };
    dispatch(setFilterParams(defaultParams));
    executeFilterSubmit(defaultParams);
  };

  const handleSignout = async () => {
    try {
      await logout({});
      localStorage.removeItem("token");
      // Explicitly set the auth state to logged out
      dispatch(setAuth({ auth: false, user: null }));
    } catch (error) {
      console.error("Signout processing dropped exception:", error);
    } finally {
      onClose();
    }
  };

  // 3. React Dynamic Inline Style Schemas
  const overlayStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    backdropFilter: "blur(4px)",
    zIndex: 1040,
  };

  const drawerStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: isOpen ? 0 : "-100%",
    width: "280px",
    height: "100%",
    backgroundColor: "#171717",
    zIndex: 1050,
    transition: "left 0.25s ease-in-out",
  };

  return (
    <>
      {/* Overlay backdrop mask */}
      {isOpen && <div style={overlayStyle} onClick={onClose} className="block sm:hidden" />}
      
      {/* Sliding Side Container Drawer */}
      <div style={drawerStyle} className="block sm:hidden border-r border-neutral-800 shadow-2xl">
        <div className="h-full flex flex-col justify-between text-neutral-300 text-base py-4">
          <div className="flex flex-col items-start w-full">
            <h3 className="w-full px-6 font-bold mt-2 mb-6 text-2xl text-white tracking-wide border-b border-neutral-800 pb-4">
              Categories
            </h3>
            
            <div className="w-full space-y-6 overflow-y-auto max-h-[calc(100vh-180px)] px-6">
              {categories.map((item) => (
                <div className="w-full flex flex-col items-start" key={item.id}>
                  <h4 className="text-green-500 font-bold text-sm uppercase tracking-wider mb-2">
                    {item.title}
                  </h4>
                  <ul className="flex flex-col items-start space-y-1 w-full">
                    {item.options.map((option) => (
                      <li className="w-full" key={option.id}>
                        <div className="flex items-center w-full py-1">
                          <input
                            id={`drawer-radio-${item.name}-${option.id}`}
                            type="radio"
                            value={option.optionValue}
                            name={`drawer-${item.name}`}
                            onChange={() => handleChange(item.name as any, option.optionValue)}
                            checked={
                              option.optionValue === (filterParams[item.name as keyof FilterParams] ?? "")
                            }
                            className="w-4 h-4 cursor-pointer accent-green-500"
                          />
                          <label
                            htmlFor={`drawer-radio-${item.name}-${option.id}`}
                            className="w-full ms-3 text-sm font-medium text-neutral-400 cursor-pointer select-none py-1 hover:text-neutral-200 transition-colors"
                          >
                            {option.optionTitle}
                          </label>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            
            {/* Filter Confirmation Action Options */}
            <div className="mt-8 flex justify-start items-center gap-3 px-6 w-full">
              <Button content="Apply" handleInput={() => executeFilterSubmit(filterParams)} />
              <button
                type="button"
                className="text-white bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 font-medium rounded-lg text-xs px-4 py-2 text-center transition-colors"
                onClick={handleClear}
              >
                Clear
              </button>
            </div>
          </div>
          
          {/* Drawer Footer Account Controls */}
          <div 
            className="mx-6 mt-4 border-t border-neutral-800 pt-4 flex items-center gap-3 text-sm font-semibold text-neutral-400 hover:text-red-400 transition-colors cursor-pointer group select-none"
            onClick={handleSignout}
          >
            <span className="flex items-center justify-center p-2 rounded-lg bg-neutral-800 group-hover:bg-red-950/30 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5 text-neutral-400 group-hover:text-red-400 transition-colors"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                />
              </svg>
            </span>
            <p>Sign Out</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Drawer;