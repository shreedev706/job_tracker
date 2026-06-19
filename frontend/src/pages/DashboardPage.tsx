import { useEffect, useState } from "react";
import { useJob } from "../hooks/useJobs";
import { useAuth } from "../hooks/useAuth";
import type { JobType } from "../http/job";
import { JobTable } from "../components/dashboard/JobTable";
import JobModal from "../components/dashboard/JobModal";

const emptyJob: {
  companyName: string;
  jobTitle: string;
  jobType: JobType;
  status: string;
  notes: string;
  appliedDate: string;
} = {
  companyName: "",
  jobTitle: "",
  jobType: "INTERNSHIP",
  status: "APPLIED",
  notes: "",
  appliedDate: "",
};

export const DashboardPage = () => {
  const { user, logout } = useAuth();
  const { jobs, loading, error, fetchJobs, deleteJob, createJob } = useJob();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newJob, setNewJob] = useState(emptyJob);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleDelete = (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this tracked application?",
      )
    ) {
      deleteJob(id);
    }
  };

  const handleAddJob = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    createJob({
      ...newJob,
      personName: user.name,
    });

    setNewJob(emptyJob);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#111111] p-8 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
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
          <JobTable jobs={jobs} onDelete={handleDelete} />
        )}

        <JobModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddJob}
          newJob={newJob}
          setNewJob={setNewJob}
        />
      </div>
    </div>
  );
};
