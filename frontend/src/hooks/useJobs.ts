import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../features/store";
import {
  fetchJobsThunk,
  createJobThunk,
  deleteJobThunk,
  setSearchQuery,
  setStatusFilter,
  setTypeFilter,
  setSortOrder,
  setCurrentPage,
  clearJobErrors,
} from "../features/job/jobSlice";
import type { CreateJobPayload } from "../http/job";

export const useJob = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    jobs,
    paginationMeta,
    loading,
    error,
    searchQuery,
    statusFilter,
    typeFilter,
    sortOrder,
    currentPage,
  } = useSelector((state: RootState) => state.job);

  const fetchJobs = useCallback(() => {
    dispatch(fetchJobsThunk());
  }, [dispatch]);

  const createJob = useCallback(
    (jobData: CreateJobPayload) => {
      dispatch(createJobThunk(jobData));
    },
    [dispatch]
  );

  const deleteJob = useCallback(
    (id: string) => {
      dispatch(deleteJobThunk(id));
    },
    [dispatch]
  );

  const updateSearchQuery = useCallback(
    (query: string) => {
      dispatch(setSearchQuery(query));
    },
    [dispatch]
  );

  const updateStatusFilter = useCallback(
    (status: string) => {
      dispatch(setStatusFilter(status));
    },
    [dispatch]
  );

  const updateTypeFilter = useCallback(
    (type: string) => {
      dispatch(setTypeFilter(type));
    },
    [dispatch]
  );

  const updateSortOrder = useCallback(
    (order: string) => {
      dispatch(setSortOrder(order));
    },
    [dispatch]
  );

  const goToPage = useCallback(
    (page: number) => {
      dispatch(setCurrentPage(page));
    },
    [dispatch]
  );

  const clearError = useCallback(() => {
    dispatch(clearJobErrors());
  }, [dispatch]);

  return {
    jobs,
    paginationMeta,
    loading,
    error,
    searchQuery,
    statusFilter,
    typeFilter,
    sortOrder,
    currentPage,
    fetchJobs,
    createJob,
    deleteJob,
    updateSearchQuery,
    updateStatusFilter,
    updateTypeFilter,
    updateSortOrder,
    goToPage,
    clearError,
  };
};