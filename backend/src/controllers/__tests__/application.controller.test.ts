import { Request, Response, NextFunction } from 'express';
import prisma from '../../prisma';
import {
  getAllApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
} from '../application.controller';


jest.mock('../../prisma', () => ({
  __esModule: true,
  default: {
    jobApplication: {
      findMany: jest.fn(),
      count: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

//  shared test helpers 
const mockRequest = (overrides: Partial<Request> = {}) =>
  ({ query: {}, params: {}, body: {}, ...overrides } as unknown as Request);

const mockResponse = () => {
  const res: Partial<Response> = {};
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  return res as Response;
};

const next = jest.fn() as unknown as NextFunction;

describe('application.controller', () => {
  // -----------------------------------------------------------------------
  describe('getAllApplications', () => {
    it('returns all applications without filtering by userId (shared board)', async () => {
      const fakeApplications = [
        { id: '1', companyName: 'Acme', jobTitle: 'Engineer', userId: 'user-A' },
        { id: '2', companyName: 'Globex', jobTitle: 'Designer', userId: 'user-B' },
      ];

      (prisma.$transaction as jest.Mock).mockResolvedValue([fakeApplications, 2]);

      const req = mockRequest();
      const res = mockResponse();

      await getAllApplications(req, res, next);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: fakeApplications,
          meta: expect.objectContaining({
            totalCount: 2,
            currentPage: 1,
          }),
        })
      );
      expect(next).not.toHaveBeenCalled();
    });
  });

  // -----------------------------------------------------------------------
  describe('getApplicationById', () => {
    it('returns an application by id regardless of which user owns it', async () => {
      const fakeApplication = { id: 'abc-123', companyName: 'Initech', userId: 'user-B' };
      (prisma.jobApplication.findFirst as jest.Mock).mockResolvedValue(fakeApplication);

      const req = mockRequest({ params: { id: 'abc-123' } });
      const res = mockResponse();

      await getApplicationById(req, res, next);

      // Confirm the lookup query is scoped ONLY by id, not userId
      expect(prisma.jobApplication.findFirst).toHaveBeenCalledWith({
        where: { id: 'abc-123' },
      });
      expect(res.json).toHaveBeenCalledWith(fakeApplication);
    });

    it('returns 404 when the application does not exist', async () => {
      (prisma.jobApplication.findFirst as jest.Mock).mockResolvedValue(null);

      const req = mockRequest({ params: { id: 'missing-id' } });
      const res = mockResponse();

      await getApplicationById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Application not found' });
    });
  });

  // -----------------------------------------------------------------------
  describe('createApplication', () => {
    it('creates an application and stamps it with the requesting userId', async () => {
      const validBody = {
        personName: 'Jane Doe',
        companyName: 'Hooli',
        jobTitle: 'Backend Engineer',
        jobType: 'FULL_TIME',
        status: 'APPLIED',
        appliedDate: '2026-06-01',
        notes: null,
      };

      const createdApplication = { id: 'new-id', ...validBody, userId: 'user-A' };
      (prisma.jobApplication.create as jest.Mock).mockResolvedValue(createdApplication);

      const req = mockRequest({ body: validBody, userId: 'user-A' } as any);
      const res = mockResponse();

      await createApplication(req, res, next);

      expect(prisma.jobApplication.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            companyName: 'Hooli',
            userId: 'user-A',
          }),
        })
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(createdApplication);
    });

    it('returns 401 when no userId can be resolved from the request', async () => {
      const validBody = {
        personName: 'Jane Doe',
        companyName: 'Hooli',
        jobTitle: 'Backend Engineer',
        jobType: 'FULL_TIME',
        status: 'APPLIED',
        appliedDate: '2026-06-01',
        notes: null,
      };

      const req = mockRequest({ body: validBody } as any); // no userId anywhere
      const res = mockResponse();

      await createApplication(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(prisma.jobApplication.create).not.toHaveBeenCalled();
    });
  });

  
  describe('updateApplication', () => {
    it('updates an application regardless of which user owns it', async () => {
      const existing = { id: 'app-1', companyName: 'Old Co', userId: 'user-B' };
      const updated = { ...existing, companyName: 'New Co' };

      (prisma.jobApplication.findFirst as jest.Mock).mockResolvedValue(existing);
      (prisma.jobApplication.update as jest.Mock).mockResolvedValue(updated);

      const req = mockRequest({
        params: { id: 'app-1' },
        body: { companyName: 'New Co' },
      });
      const res = mockResponse();

      await updateApplication(req, res, next);

      
      expect(prisma.jobApplication.findFirst).toHaveBeenCalledWith({
        where: { id: 'app-1' },
      });
      expect(prisma.jobApplication.update).toHaveBeenCalledWith({
        where: { id: 'app-1' },
        data: { companyName: 'New Co' },
      });
      expect(res.json).toHaveBeenCalledWith(updated);
    });

    it('returns 404 when updating an application that does not exist', async () => {
      (prisma.jobApplication.findFirst as jest.Mock).mockResolvedValue(null);

      const req = mockRequest({
        params: { id: 'missing-id' },
        body: { companyName: 'New Co' },
      });
      const res = mockResponse();

      await updateApplication(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(prisma.jobApplication.update).not.toHaveBeenCalled();
    });
  });

  
  describe('deleteApplication', () => {
    it('deletes an application regardless of which user owns it', async () => {
      const existing = { id: 'app-1', companyName: 'Acme', userId: 'user-B' };
      (prisma.jobApplication.findFirst as jest.Mock).mockResolvedValue(existing);
      (prisma.jobApplication.delete as jest.Mock).mockResolvedValue(existing);

      const req = mockRequest({ params: { id: 'app-1' } });
      const res = mockResponse();

      await deleteApplication(req, res, next);

      expect(prisma.jobApplication.findFirst).toHaveBeenCalledWith({
        where: { id: 'app-1' },
      });
      expect(prisma.jobApplication.delete).toHaveBeenCalledWith({
        where: { id: 'app-1' },
      });
      expect(res.json).toHaveBeenCalledWith({ message: 'Application successfully deleted' });
    });

    it('returns 404 when deleting an application that does not exist', async () => {
      (prisma.jobApplication.findFirst as jest.Mock).mockResolvedValue(null);

      const req = mockRequest({ params: { id: 'missing-id' } });
      const res = mockResponse();

      await deleteApplication(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(prisma.jobApplication.delete).not.toHaveBeenCalled();
    });
  });
});