import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/authController.ts';

const router = Router();

// Route: POST /api/auth/register
router.post('/register', registerUser);

// Route: POST /api/auth/login
router.post('/login', loginUser);

export default router;
