import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import  type { Job } from "../../pages/Dashboard"; // Reusing our strong Job type definition

// 1. Define the internal shape of your query parameter states
interface FilterParams {
  status: string;
  workType: string;
  sort: string;
  search: string;
  page: number;
  limit: number;
}

// 2. Define the structural state schema of this slice
interface JobState {
  isSuccess: boolean;
  totalJobs: number;
  jobs: Job[];
  numOfPage: number;
  filterParams: FilterParams;
}

const initialState: JobState = {
  isSuccess: false,
  totalJobs: 0,
  jobs: [],
  numOfPage: 0,
  filterParams: {
    status: "all",
    workType: "all",
    sort: "latest",
    search: "",
    page: 1,
    limit: 10,
  },
};

// 3. Define payload schemas for explicit actions
interface SuccessPayload {
  success: boolean;
}

interface JobsPayload {
  totalJobs: number;
  jobs: Job[];
  numOfPage: number;
}

export const jobSlice = createSlice({
  name: "job",
  initialState,
  reducers: {
    setSuccess: (state, action: PayloadAction<SuccessPayload>) => {
      const { success } = action.payload;
      state.isSuccess = success;
    },

    setJobs: (state, action: PayloadAction<JobsPayload>) => {
      const { totalJobs, jobs, numOfPage } = action.payload;
      state.totalJobs = totalJobs;
      state.jobs = jobs;
      state.numOfPage = numOfPage;
    },

    setFilterParams: (state, action: PayloadAction<Partial<FilterParams>>) => {
      const filterParams = action.payload;
      state.filterParams = { ...state.filterParams, ...filterParams };
    },

    resetSearch: (state) => {
      state.filterParams.search = "";
    },
  },
});

export const { setSuccess, setJobs, setFilterParams, resetSearch } = jobSlice.actions;

export default jobSlice.reducer;