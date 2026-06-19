import type { JobApplication } from "../../http/job";

interface JobTableProps {
  jobs: JobApplication[];
  onDelete: (id: string) => void;
}

export const JobTable = ({ jobs, onDelete }: JobTableProps) => {
  if (!jobs || jobs.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400 border border-gray-700 rounded-lg bg-[#1a1a1a]">
        No jobs tracked yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-gray-700 rounded-lg bg-[#1a1a1a]">
      <table className="w-full text-left text-sm text-white border-collapse">
        <thead>
          <tr className="bg-[#222222] text-gray-300 border-b border-gray-700">
            <th className="p-4">Company</th>
            <th className="p-4">Role</th>
            <th className="p-4">Type</th>
            <th className="p-4">Status</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr
              key={job.id}
              className="border-b border-gray-800 hover:bg-[#252525] transition"
            >
              <td className="p-4 font-medium">{job.companyName}</td>
              <td className="p-4">{job.jobTitle}</td>
              <td className="p-4">
                <span className="px-2 py-1 bg-gray-800 rounded text-xs">
                  {job.jobType}
                </span>
              </td>
              <td className="p-4">
                <span className="px-2 py-1 bg-blue-950 text-blue-300 rounded text-xs">
                  {job.status}
                </span>
              </td>
              <td className="p-4">
                <button
                  onClick={() => onDelete(job.id!)}
                  className="text-red-400 hover:text-red-300 font-medium"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
