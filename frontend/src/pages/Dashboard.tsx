import React, { useEffect, useState } from "react";
import { Navbar } from "../components/shared";
import Modal from "../components/createModal/Modal";
import { getJobs } from "../http/http";
import { useDispatch, useSelector } from "react-redux";
import { setJobs, setSuccess } from "../features/jobs/jobSlice";
import Table from "../components/table/Table";
import Pagination from "../components/pagination/Pagination";
import Category from "../components/category/Category";
import Search from "../components/shared/Search";
import Drawer from "../components/drawer/Drawer";

export interface Job {
  _id: string;
  company: string;
  position: string;
  workType: string;
  workLocation: string;
  status: string;
  personName?: string;
  appliedDate: string | Date;
  notes?: string;
  createdAt: string;
}

interface RootState {
  job: {
    jobs: Job[];
    totalJobs: number;
  };
}

// Stat card component
const StatCard: React.FC<{
  label: string;
  value: number;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ReactNode;
}> = ({ label, value, color, bgColor, borderColor, icon }) => (
  <div
    className="flex items-center gap-3 px-4 py-3 rounded-xl"
    style={{ background: bgColor, border: `0.5px solid ${borderColor}` }}
  >
    <div
      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
      style={{ background: borderColor }}
    >
      <span style={{ color }}>{icon}</span>
    </div>
    <div>
      <p className="text-xl font-semibold text-white leading-none">{value}</p>
      <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</p>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const dispatch = useDispatch();
  const jobs = useSelector((state: RootState) => state.job.jobs);
  const totalJobs = useSelector((state: RootState) => state.job.totalJobs);

  const toggleDrawer = () => setIsDrawerOpen((v) => !v);

  const getAllJobsData = async () => {
    try {
      const response = await getJobs();
      const data = response.data;
      dispatch(setSuccess(data));
      dispatch(setJobs(data));
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  useEffect(() => {
    getAllJobsData();
  }, []);

  // Derived stats from current job list
  const pending = jobs.filter((j) => j.status?.toLowerCase() === "pending").length;
  const interview = jobs.filter((j) => j.status?.toLowerCase() === "interview").length;
  const rejected = jobs.filter((j) => j.status?.toLowerCase() === "reject").length;

  return (
    <>
      <Navbar toggleDrawer={toggleDrawer} />

      <section
        className="min-h-screen pt-14 text-neutral-300"
        style={{ background: "#0a0b0f" }}
      >
        {/* Filter bar */}
        <Category />

        {/* Stats + actions row */}
        <div className="px-4 md:px-16 pt-6 pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

            {/* Stat cards */}
            <div className="grid grid-cols-2 sm:flex sm:flex-row gap-2 sm:gap-3">
              <StatCard
                label="Total"
                value={totalJobs}
                color="#a3a3a3"
                bgColor="rgba(255,255,255,0.03)"
                borderColor="rgba(255,255,255,0.06)"
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12h6m-3-3v6M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              <StatCard
                label="Pending"
                value={pending}
                color="#facc15"
                bgColor="rgba(250,204,21,0.04)"
                borderColor="rgba(250,204,21,0.1)"
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
                  </svg>
                }
              />
              <StatCard
                label="Interview"
                value={interview}
                color="#22c55e"
                bgColor="rgba(34,197,94,0.04)"
                borderColor="rgba(34,197,94,0.1)"
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                }
              />
              <StatCard
                label="Rejected"
                value={rejected}
                color="#f87171"
                bgColor="rgba(248,113,113,0.04)"
                borderColor="rgba(248,113,113,0.1)"
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
            </div>

            {/* Right: search + new job */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex">
                <Search />
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-shrink-0"
                style={{ background: "#22c55e", color: "#0a1a0e" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#16a34a")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#22c55e")}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                New Job
              </button>
            </div>
          </div>

          {/* Mobile search */}
          <div className="flex sm:hidden mt-3">
            <Search />
          </div>
        </div>

        {/* Table or empty state */}
        {totalJobs === 0 ? (
          <div className="flex flex-col items-center justify-center px-10 py-24 gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(34,197,94,0.06)", border: "0.5px solid rgba(34,197,94,0.15)" }}
            >
              <svg className="w-8 h-8" style={{ color: "rgba(34,197,94,0.5)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-base font-medium text-neutral-300">No applications yet</p>
              <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>
                Track your first job application to get started.
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="mt-1 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
              style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e", border: "0.5px solid rgba(34,197,94,0.2)" }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add your first job
            </button>
          </div>
        ) : (
          <Table jobs={jobs} getAllJobsData={getAllJobsData} />
        )}

        <div className="my-8 w-full flex items-center justify-center">
          <Pagination />
        </div>

        {showModal && (
          <Modal setShowModal={setShowModal} getAllJobsData={getAllJobsData} />
        )}

        <Drawer isOpen={isDrawerOpen} onClose={toggleDrawer} />
      </section>
    </>
  );
};

export default Dashboard;