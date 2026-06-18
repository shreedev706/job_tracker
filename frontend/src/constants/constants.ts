// 1. Define structural interface for single option items
export interface FilterOption {
  id: number;
  optionTitle: string;
  optionValue: string;
}

// 2. Define structural interface for the top-level category groupings
export interface CategoryFilterGroup {
  id: number;
  title: string;
  name: "status" | "workType" | "sort"; // Strictly locks these keys to match your jobSlice parameters
  options: FilterOption[];
}

const categories: CategoryFilterGroup[] = [
  {
    id: 1,
    title: "Status",
    name: "status",
    options: [
      {
        id: 1,
        optionTitle: "Pending",
        optionValue: "pending",
      },
      {
        id: 2,
        optionTitle: "Interview",
        optionValue: "interview",
      },
      {
        id: 3,
        optionTitle: "Rejected",
        optionValue: "reject",
      },
      {
        id: 4,
        optionTitle: "All",
        optionValue: "all",
      },
    ],
  },
  {
    id: 2,
    title: "Work Type",
    name: "workType",
    options: [
      {
        id: 1,
        optionTitle: "Full-Time",
        optionValue: "full-time",
      },
      {
        id: 2,
        optionTitle: "Part-Time",
        optionValue: "part-time",
      },
      {
        id: 3,
        optionTitle: "Internship",
        optionValue: "internship",
      },
      {
        id: 4,
        optionTitle: "Contract",
        optionValue: "contract", // ✨ Fixed typo ("contaract" -> "contract")
      },
      {
        id: 5,
        optionTitle: "All",
        optionValue: "all",
      },
    ],
  },
  {
    id: 3,
    title: "Sort",
    name: "sort",
    options: [
      {
        id: 1,
        optionTitle: "Latest",
        optionValue: "latest",
      },
      {
        id: 2,
        optionTitle: "Oldest",
        optionValue: "oldest",
      },
      {
        id: 3,
        optionTitle: "A-Z",
        optionValue: "a-z",
      },
      {
        id: 4,
        optionTitle: "Z-A",
        optionValue: "z-a",
      },
    ],
  },
];

export { categories };