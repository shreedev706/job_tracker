import api from "./axiosInstance";

export type JobType = "INTERNSHIP" | "FULL_TIME" | "PART_TIME";

export interface JobApplication {
  id: string;
  companyName: string;
  jobTitle: string;
  jobType: JobType;
  status: string;
  personName: string;
  appliedDate: string | Date;
  notes?: string | null;
  createdAt?: string;
}

// Shape required when CREATING a job — matches backend Zod schema exactly
export interface CreateJobPayload {
  companyName: string;
  jobTitle: string;
  jobType: JobType;
  status: string;
  personName: string;
  appliedDate: string | Date;
  notes?: string | null;
}

export interface JobFilters {
  search?: string;
  status?: string;
  jobType?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
}

export const fetchApplicationsApi = async (filters: JobFilters) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== "all" && value !== "All") {
      params.append(key, value as string);
    }
  });
  const response = await api.get(`/applications?${params.toString()}`);
  return response.data;
};

export const createApplicationApi = async (jobData: CreateJobPayload) => {
  const response = await api.post("/applications", jobData);
  return response.data;
};

export const updateApplicationApi = async (id: string, jobData: Partial<JobApplication>) => {
  const response = await api.put(`/applications/${id}`, jobData);
  return response.data;
};

export const deleteApplicationApi = async (id: string) => {
  const response = await api.delete(`/applications/${id}`);
  return response.data;
};