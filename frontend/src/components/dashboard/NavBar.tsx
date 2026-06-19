import SearchBar from "./SearchBar";

interface NavBarProps {
  user: any;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isFilterOpen: boolean;
  setIsFilterOpen: (open: boolean) => void;
  onLogout: () => void;
}

const NavBar = ({
  user,
  searchQuery,
  setSearchQuery,
  isFilterOpen,
  setIsFilterOpen,
  onLogout,
}: NavBarProps) => {
  return (
    <header className="w-full h-16 bg-[#111827] border-b border-gray-800 flex items-center justify-between px-6 shadow-md">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full border-2 border-emerald-500 flex items-center justify-center">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
        </div>
        <span className="text-lg font-bold text-white tracking-tight">
          JobTrackr<span className="text-emerald-400">.com</span>
        </span>
      </div>

      <button
        onClick={() => setIsFilterOpen(!isFilterOpen)}
        className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white flex items-center justify-center transition-all border border-gray-700"
      >
        {isFilterOpen ? "✕" : "☰"}
      </button>

      <div className="flex items-center gap-4">
        {/* Extracted Component Instance */}
        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        <div className="w-8 h-8 rounded-full bg-linear-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold uppercase shadow-inner">
          {user?.name ? user.name[0] : "U"}
        </div>

        <button
          onClick={onLogout}
          className="text-gray-400 hover:text-red-400 text-lg"
          title="Log Out"
        >
          🗙
        </button>
      </div>
    </header>
  );
};

export default NavBar;
