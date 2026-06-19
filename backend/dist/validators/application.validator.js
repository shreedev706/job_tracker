"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateApplicationSchema = exports.CreateApplicationSchema = exports.StatusEnum = exports.JobTypeEnum = void 0;
const zod_1 = require("zod");
exports.JobTypeEnum = zod_1.z.enum(['INTERNSHIP', 'FULL_TIME', 'PART_TIME']);
exports.StatusEnum = zod_1.z.enum(['APPLIED', 'INTERVIEWING', 'OFFER', 'REJECTED']);
exports.CreateApplicationSchema = zod_1.z.object({
    personName: zod_1.z.string().optional().nullable(), // 👈 Added rule
    companyName: zod_1.z.string().min(2, 'Company name must be at least 2 characters'),
    jobTitle: zod_1.z.string().min(1, 'Job title is required'),
    jobType: exports.JobTypeEnum,
    status: exports.StatusEnum,
    appliedDate: zod_1.z.string().transform((str) => new Date(str)),
    notes: zod_1.z.string().optional().nullable(),
});
exports.UpdateApplicationSchema = exports.CreateApplicationSchema.partial();
