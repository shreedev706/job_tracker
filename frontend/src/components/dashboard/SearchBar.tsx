interface SearchBarProps {
  value: string;
  onChange: (query: string) => void;
}

const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search by position, company..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-64 bg-[#1f2937] text-sm text-gray-200 pl-4 pr-10 py-1.5 rounded-md border border-gray-700 focus:outline-none focus:border-emerald-500 transition-colors placeholder-gray-500"
      />
      <span className="absolute right-3 top-2.5 text-gray-500 text-xs">🔍</span>
    </div>
  );
};

export default SearchBar;
