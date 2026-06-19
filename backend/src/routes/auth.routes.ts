import { Router } from 'express';
import { register, login, refresh, logout, getCurrentUser } from '../controllers/auth.controller';
import { authenticateJWT} from '../middlewares/auth.middlewares';


const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', authenticateJWT, getCurrentUser);

export default router;