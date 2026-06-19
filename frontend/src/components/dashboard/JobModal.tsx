interface JobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  newJob: {
    companyName: string;
    jobTitle: string;
    jobType: string;
    status: string;
    notes: string;
    appliedDate: string;
  };
  setNewJob: (job: any) => void;
}

const JobModal = ({
  isOpen,
  onClose,
  onSubmit,
  newJob,
  setNewJob,
}: JobModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#111827] border border-gray-800 rounded-xl w-full max-w-md p-6 shadow-2xl space-y-4">
        <div className="flex justify-between items-center border-b border-gray-800 pb-3">
          <h3 className="text-lg font-bold text-white">
            Track New Job Application
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Company Name *
            </label>
            <input
              type="text"
              required
              minLength={2}
              placeholder="Minimum 2 characters"
              value={newJob.companyName}
              onChange={(e) =>
                setNewJob({ ...newJob, companyName: e.target.value })
              }
              className="w-full bg-[#1f2937] text-sm text-gray-100 p-2.5 rounded-md border border-gray-700 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Job Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Frontend Engineer"
              value={newJob.jobTitle}
              onChange={(e) =>
                setNewJob({ ...newJob, jobTitle: e.target.value })
              }
              className="w-full bg-[#1f2937] text-sm text-gray-100 p-2.5 rounded-md border border-gray-700 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Job Type *
              </label>
              <select
                value={newJob.jobType}
                onChange={(e) =>
                  setNewJob({ ...newJob, jobType: e.target.value })
                }
                className="w-full bg-[#1f2937] text-sm text-gray-100 p-2.5 rounded-md border border-gray-700 focus:outline-none focus:border-emerald-500"
              >
                <option value="INTERNSHIP">Internship</option>
                <option value="FULL_TIME">Full-time</option>
                <option value="PART_TIME">Part-time</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Status *
              </label>
              <select
                value={newJob.status}
                onChange={(e) =>
                  setNewJob({ ...newJob, status: e.target.value })
                }
                className="w-full bg-[#1f2937] text-sm text-gray-100 p-2.5 rounded-md border border-gray-700 focus:outline-none focus:border-emerald-500"
              >
                <option value="APPLIED">Applied</option>
                <option value="INTERVIEWING">Interviewing</option>
                <option value="OFFER">Offer</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Applied Date *
            </label>
            <input
              type="date"
              required
              value={newJob.appliedDate}
              onChange={(e) =>
                setNewJob({ ...newJob, appliedDate: e.target.value })
              }
              className="w-full bg-[#1f2937] text-sm text-gray-100 p-2.5 rounded-md border border-gray-700 focus:outline-none focus:border-emerald-500 color-scheme-dark"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Notes (Optional)
            </label>
            <textarea
              placeholder="Add key observations or links..."
              value={newJob.notes}
              rows={3}
              onChange={(e) => setNewJob({ ...newJob, notes: e.target.value })}
              className="w-full bg-[#1f2937] text-sm text-gray-100 p-2.5 rounded-md border border-gray-700 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3 text-sm font-medium">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#10b981] hover:bg-[#059669] text-white rounded-md shadow-md cursor-pointer"
            >
              Track Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobModal;
