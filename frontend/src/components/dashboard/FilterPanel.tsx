interface FilterPanelProps {
  isFilterOpen: boolean;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  typeFilter: string;
  setTypeFilter: (type: string) => void;
  sortOrder: string;
  setSortOrder: (order: string) => void;
}

const FilterPanel = ({
  isFilterOpen,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
  sortOrder,
  setSortOrder,
}: FilterPanelProps) => {
  if (!isFilterOpen) return null;

  return (
    <div className="p-4 bg-[#111827] border border-gray-800 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm shadow-md">
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase mb-1.5 tracking-wider">
          Filter Status
        </label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full bg-[#1f2937] text-gray-200 p-2 rounded-md border border-gray-700 focus:outline-none focus:border-emerald-500"
        >
          <option value="all">All Statuses</option>
          <option value="APPLIED">Applied</option>
          <option value="INTERVIEWING">Interviewing</option>
          <option value="OFFER">Offer</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase mb-1.5 tracking-wider">
          Filter Job Type
        </label>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="w-full bg-[#1f2937] text-gray-200 p-2 rounded-md border border-gray-700 focus:outline-none focus:border-emerald-500"
        >
          <option value="All">All Types</option>
          <option value="INTERNSHIP">Internship</option>
          <option value="FULL_TIME">Full-time</option>
          <option value="PART_TIME">Part-time</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase mb-1.5 tracking-wider">
          Chronological Order
        </label>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="w-full bg-[#1f2937] text-gray-200 p-2 rounded-md border border-gray-700 focus:outline-none focus:border-emerald-500"
        >
          <option value="Latest">Latest Added</option>
          <option value="Oldest">Oldest Added</option>
        </select>
      </div>
    </div>
  );
};

export default FilterPanel;
