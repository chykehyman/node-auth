import express from 'express';
import {
  forgotPassword,
  login,
  register,
  resetPassword,
} from '../controllers/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.put('/resetPassword/:resetToken', resetPassword);

export default router;
