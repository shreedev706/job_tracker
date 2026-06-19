import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { fetchApplicationsApi, createApplicationApi, updateApplicationApi, deleteApplicationApi } from "../../http/job";
import type { JobApplication, CreateJobPayload } from "../../http/job";

interface JobState {
  jobs: JobApplication[];
  paginationMeta: {
    totalCount: number;
    limit: number;
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  } | null;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  statusFilter: string;
  typeFilter: string;
  sortOrder: string;
  currentPage: number;
}

const initialState: JobState = {
  jobs: [],
  paginationMeta: null,
  loading: false,
  error: null,
  searchQuery: "",
  statusFilter: "all",
  typeFilter: "all",
  sortOrder: "Latest",
  currentPage: 1,
};

export const fetchJobsThunk = createAsyncThunk(
  "job/fetchAll",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { job: JobState };
    const { searchQuery, statusFilter, typeFilter, currentPage, sortOrder } = state.job;

    try {
      const response = await fetchApplicationsApi({
        search: searchQuery,
        status: statusFilter,
        jobType: typeFilter,
        page: currentPage.toString(),
        limit: "10",
        sortBy: "createdAt",
        sortOrder: sortOrder === "Latest" ? "desc" : "asc",
      });
      return response;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to load jobs.");
    }
  }
);

export const createJobThunk = createAsyncThunk(
  "job/create",
  async (jobData: CreateJobPayload, { dispatch, rejectWithValue }) => {
    try {
      const response = await createApplicationApi(jobData);
      dispatch(fetchJobsThunk());
      return response;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Could not save entry.");
    }
  }
);

export const updateJobThunk = createAsyncThunk(
  "job/update",
  async ({ id, jobData }: { id: string; jobData: Partial<JobApplication> }, { dispatch, rejectWithValue }) => {
    try {
      const response = await updateApplicationApi(id, jobData);
      dispatch(fetchJobsThunk());
      return response;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Could not update entry.");
    }
  }
);

export const deleteJobThunk = createAsyncThunk(
  "job/delete",
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      await deleteApplicationApi(id);
      dispatch(fetchJobsThunk());
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Could not delete job.");
    }
  }
);

const jobSlice = createSlice({
  name: "job",
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
      state.currentPage = 1;
    },
    setStatusFilter(state, action: PayloadAction<string>) {
      state.statusFilter = action.payload;
      state.currentPage = 1;
    },
    setTypeFilter(state, action: PayloadAction<string>) {
      state.typeFilter = action.payload;
      state.currentPage = 1;
    },
    setSortOrder(state, action: PayloadAction<string>) {
      state.sortOrder = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    clearJobErrors(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.data || action.payload || [];

        const meta = action.payload.meta;
        if (meta) {
          state.paginationMeta = {
            totalCount: meta.totalCount,
            limit: meta.limit,
            currentPage: meta.currentPage,
            totalPages: meta.totalPages,
            hasNextPage: meta.hasNextPage,
            hasPrevPage: meta.hasPrevPage,
          };
        }
      })
      .addCase(fetchJobsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createJobThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJobThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createJobThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateJobThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateJobThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateJobThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteJobThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteJobThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteJobThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSearchQuery,
  setStatusFilter,
  setTypeFilter,
  setSortOrder,
  setCurrentPage,
  clearJobErrors,
} = jobSlice.actions;

export default jobSlice.reducer;