import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma';
import { CreateApplicationSchema, UpdateApplicationSchema } from '../validators/application.validator';

// Helper to extract userId cleanly from any common payload format
const getRequestUserId = (req: Request): string | null => {
  return (req as any).userId || (req as any).id || (req as any).user?.id || (req as any).user?.userId || null;
};

// 🚀 GET /applications - Shared board, visible to everyone
export const getAllApplications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Extract query parameters with smart fallbacks
    const search = req.query.search as string || '';
    const status = req.query.status as string || '';
    const jobType = req.query.jobType as string || '';
    
    const sortBy = req.query.sortBy as string || 'createdAt';
    const sortOrder = (req.query.sortOrder as string) === 'asc' ? 'asc' : 'desc';

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // 2. Construct the where clause—no userId scoping, shared across all users
    const whereClause: any = {};

    if (search) {
      whereClause.OR = [
        { companyName: { contains: search, mode: 'insensitive' } },
        { jobTitle: { contains: search, mode: 'insensitive' } },
        { personName: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) whereClause.status = status.toUpperCase();
    if (jobType) whereClause.jobType = jobType.toUpperCase();

    // 3. Concurrent multi-query transaction
    const [applications, totalCount] = await prisma.$transaction([
      prisma.jobApplication.findMany({
        where: whereClause,
        orderBy: { [sortBy]: sortOrder },
        skip: skip,
        take: limit,
      }),
      prisma.jobApplication.count({ where: whereClause }),
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
  } catch (error) {
    next(error);
  }
};

export const getApplicationById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;

    const application = await prisma.jobApplication.findFirst({ 
      where: { id: id }
    });
    
    if (!application) return res.status(404).json({ error: 'Application not found' });
    return res.json(application);
  } catch (error) {
    next(error);
  }
};

// ✨ POST /applications
export const createApplication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = CreateApplicationSchema.parse(req.body);
    const userId = getRequestUserId(req);

    if (!userId) {
      return res.status(401).json({ 
        success: false,
        error: 'Authentication Lost',
        message: 'Could not resolve your user ID. Please hit POST /auth/login again in Postman to set fresh cookies.' 
      });
    }

    const newApplication = await prisma.jobApplication.create({
      data: {
        personName: validatedData.personName,   
        companyName: validatedData.companyName,
        jobTitle: validatedData.jobTitle,
        jobType: validatedData.jobType,
        status: validatedData.status,
        appliedDate: new Date(validatedData.appliedDate),
        notes: validatedData.notes,
        userId: userId, 
      } as any 
    });

    return res.status(201).json(newApplication);
  } catch (error: any) {
    next(error); 
  }
};

// 📝 PATCH /applications/:id - Anyone can edit any application
export const updateApplication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const validatedData = UpdateApplicationSchema.parse(req.body);

    const exists = await prisma.jobApplication.findFirst({ 
      where: { id: id }
    });
    if (!exists) return res.status(404).json({ error: 'Application not found' });

    const updated = await prisma.jobApplication.update({
      where: { id: id },
      data: validatedData,
    });
    return res.json(updated);
  } catch (error: any) {
    next(error);
  }
};

// 🗑️ DELETE /applications/:id - Anyone can delete any application
export const deleteApplication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;

    const exists = await prisma.jobApplication.findFirst({ 
      where: { id: id }
    });
    if (!exists) return res.status(404).json({ error: 'Application not found' });

    await prisma.jobApplication.delete({ 
      where: { id: id }
    });
    return res.json({ message: 'Application successfully deleted' });
  } catch (error) {
    next(error);
  }
};