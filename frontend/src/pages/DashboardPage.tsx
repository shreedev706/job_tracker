import { useEffect, useState, useRef } from "react";
import { useJob } from "../hooks/useJobs";
import { useAuth } from "../hooks/useAuth";
import type { JobType, JobApplication } from "../http/job";
import { JobTable } from "../components/dashboard/JobTable";
import JobModal from "../components/dashboard/JobModal";
import SearchBar from "../components/dashboard/SearchBar";
import FilterPanel from "../components/dashboard/FilterPanel";
import Pagination from "../components/dashboard/Pagination";

type JobFormState = {
  companyName: string;
  jobTitle: string;
  jobType: JobType;
  status: string;
  notes: string;
  appliedDate: string;
};

const emptyJob: JobFormState = {
  companyName: "",
  jobTitle: "",
  jobType: "INTERNSHIP",
  status: "APPLIED",
  notes: "",
  appliedDate: "",
};

const toDateInputValue = (date: string | Date) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().split("T")[0];
};

export const DashboardPage = () => {
  const { user, logout } = useAuth();
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
    fetchJobs,
    createJob,
    updateJob,
    deleteJob,
    updateSearchQuery,
    updateStatusFilter,
    updateTypeFilter,
    updateSortOrder,
    goToPage,
  } = useJob();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">(
    "create",
  );
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [newJob, setNewJob] = useState<JobFormState>(emptyJob);
  const [isFilterOpen, setIsFilterOpen] = useState(false);


  const [searchInput, setSearchInput] = useState(searchQuery);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  
  useEffect(() => {
    fetchJobs();
    
  }, [searchQuery, statusFilter, typeFilter, sortOrder, currentPage]);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateSearchQuery(value);
    }, 400);
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleDelete = (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this tracked application?",
      )
    ) {
      deleteJob(id);
    }
  };

  const openCreateModal = () => {
    setModalMode("create");
    setActiveJobId(null);
    setNewJob(emptyJob);
    setIsModalOpen(true);
  };

  const openViewModal = (job: JobApplication) => {
    setModalMode("view");
    setActiveJobId(job.id);
    setNewJob({
      companyName: job.companyName,
      jobTitle: job.jobTitle,
      jobType: job.jobType,
      status: job.status,
      notes: job.notes || "",
      appliedDate: toDateInputValue(job.appliedDate),
    });
    setIsModalOpen(true);
  };

  const openEditModal = (job: JobApplication) => {
    setModalMode("edit");
    setActiveJobId(job.id);
    setNewJob({
      companyName: job.companyName,
      jobTitle: job.jobTitle,
      jobType: job.jobType,
      status: job.status,
      notes: job.notes || "",
      appliedDate: toDateInputValue(job.appliedDate),
    });
    setIsModalOpen(true);
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (modalMode === "create") {
      if (!user) return;
      createJob({ ...newJob, personName: user.name });
    } else if (modalMode === "edit" && activeJobId) {
      updateJob(activeJobId, newJob);
    }

    setIsModalOpen(false);
    setNewJob(emptyJob);
    setActiveJobId(null);
  };

  return (
    <div className="min-h-screen bg-[#111111] p-8 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={openCreateModal}
              className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded font-semibold transition shadow"
            >
              + Add Job
            </button>
            <button
              onClick={logout}
              className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded font-semibold transition shadow text-gray-200"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <SearchBar value={searchInput} onChange={handleSearchChange} />
          <button
            onClick={() => setIsFilterOpen((open) => !open)}
            className="px-4 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-md text-sm font-medium text-gray-200 transition"
          >
            {isFilterOpen ? "Hide Filters" : "Filters"}
          </button>
        </div>

        <div className="mb-6">
          <FilterPanel
            isFilterOpen={isFilterOpen}
            statusFilter={statusFilter}
            setStatusFilter={updateStatusFilter}
            typeFilter={typeFilter}
            setTypeFilter={updateTypeFilter}
            sortOrder={sortOrder}
            setSortOrder={updateSortOrder}
          />
        </div>

        {error && (
          <div className="bg-red-950 border border-red-800 text-red-300 p-4 rounded mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-gray-400 animate-pulse">
            Loading tracked applications...
          </div>
        ) : (
          <>
            <JobTable
              jobs={jobs}
              onView={openViewModal}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
            <div className="mt-4">
              <Pagination meta={paginationMeta} onPageChange={goToPage} />
            </div>
          </>
        )}

        <JobModal
          isOpen={isModalOpen}
          mode={modalMode}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleModalSubmit}
          newJob={newJob}
          setNewJob={setNewJob}
        />
      </div>
    </div>
  );
};
