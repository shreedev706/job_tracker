import { Router } from 'express';
import { authenticateJWT } from '../middlewares/auth.middlewares';
import { 
  getAllApplications, 
  getApplicationById, 
  createApplication, 
  updateApplication, 
  deleteApplication 
} from '../controllers/application.controller';

const router = Router();

// 🔒 All routes now pass through the JWT check first!
router.get('/', authenticateJWT, getAllApplications);
router.get('/:id', authenticateJWT, getApplicationById);
router.post('/', authenticateJWT, createApplication);
router.patch('/:id', authenticateJWT, updateApplication);
router.delete('/:id', authenticateJWT, deleteApplication);

export default router;