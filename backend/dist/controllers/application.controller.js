"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteApplication = exports.updateApplication = exports.createApplication = exports.getApplicationById = exports.getAllApplications = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const application_validator_1 = require("../validators/application.validator");
// Helper to extract userId cleanly from any common payload format
const getRequestUserId = (req) => {
    return req.userId || req.id || req.user?.id || req.user?.userId || null;
};
// 🚀 GET /applications - Shared board, visible to everyone
const getAllApplications = async (req, res, next) => {
    try {
        // 1. Extract query parameters with smart fallbacks
        const search = req.query.search || '';
        const status = req.query.status || '';
        const jobType = req.query.jobType || '';
        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 'asc' : 'desc';
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        // 2. Construct the where clause—no userId scoping, shared across all users
        const whereClause = {};
        if (search) {
            whereClause.OR = [
                { companyName: { contains: search, mode: 'insensitive' } },
                { jobTitle: { contains: search, mode: 'insensitive' } },
                { personName: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (status)
            whereClause.status = status.toUpperCase();
        if (jobType)
            whereClause.jobType = jobType.toUpperCase();
        // 3. Concurrent multi-query transaction
        const [applications, totalCount] = await prisma_1.default.$transaction([
            prisma_1.default.jobApplication.findMany({
                where: whereClause,
                orderBy: { [sortBy]: sortOrder },
                skip: skip,
                take: limit,
            }),
            prisma_1.default.jobApplication.count({ where: whereClause }),
        ]);
        const totalPages = Math.ceil(totalCount / limit);
        return res.json({
            data: applications,
            meta: {
                totalCount,
                totalPages,
                currentPage: page,
                limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllApplications = getAllApplications;
const getApplicationById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const application = await prisma_1.default.jobApplication.findFirst({
            where: { id: id }
        });
        if (!application)
            return res.status(404).json({ error: 'Application not found' });
        return res.json(application);
    }
    catch (error) {
        next(error);
    }
};
exports.getApplicationById = getApplicationById;
// ✨ POST /applications
const createApplication = async (req, res, next) => {
    try {
        const validatedData = application_validator_1.CreateApplicationSchema.parse(req.body);
        const userId = getRequestUserId(req);
        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'Authentication Lost',
                message: 'Could not resolve your user ID. Please hit POST /auth/login again in Postman to set fresh cookies.'
            });
        }
        const newApplication = await prisma_1.default.jobApplication.create({
            data: {
                personName: validatedData.personName,
                companyName: validatedData.companyName,
                jobTitle: validatedData.jobTitle,
                jobType: validatedData.jobType,
                status: validatedData.status,
                appliedDate: new Date(validatedData.appliedDate),
                notes: validatedData.notes,
                userId: userId,
            }
        });
        return res.status(201).json(newApplication);
    }
    catch (error) {
        next(error);
    }
};
exports.createApplication = createApplication;
// 📝 PATCH /applications/:id - Anyone can edit any application
const updateApplication = async (req, res, next) => {
    try {
        const id = req.params.id;
        const validatedData = application_validator_1.UpdateApplicationSchema.parse(req.body);
        const exists = await prisma_1.default.jobApplication.findFirst({
            where: { id: id }
        });
        if (!exists)
            return res.status(404).json({ error: 'Application not found' });
        const updated = await prisma_1.default.jobApplication.update({
            where: { id: id },
            data: validatedData,
        });
        return res.json(updated);
    }
    catch (error) {
        next(error);
    }
};
exports.updateApplication = updateApplication;
// 🗑️ DELETE /applications/:id - Anyone can delete any application
const deleteApplication = async (req, res, next) => {
    try {
        const id = req.params.id;
        const exists = await prisma_1.default.jobApplication.findFirst({
            where: { id: id }
        });
        if (!exists)
            return res.status(404).json({ error: 'Application not found' });
        await prisma_1.default.jobApplication.delete({
            where: { id: id }
        });
        return res.json({ message: 'Application successfully deleted' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteApplication = deleteApplication;
