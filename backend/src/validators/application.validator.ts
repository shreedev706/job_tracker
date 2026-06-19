import { z } from 'zod';

export const JobTypeEnum = z.enum(['INTERNSHIP', 'FULL_TIME', 'PART_TIME']);
export const StatusEnum = z.enum(['APPLIED', 'INTERVIEWING', 'OFFER', 'REJECTED']);

export const CreateApplicationSchema = z.object({
  personName: z.string().optional().nullable(),   // 👈 Added rule
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  jobTitle: z.string().min(1, 'Job title is required'),
  jobType: JobTypeEnum,
  status: StatusEnum,
  appliedDate: z.string().transform((str) => new Date(str)), 
  notes: z.string().optional().nullable(),
});

export const UpdateApplicationSchema = CreateApplicationSchema.partial();