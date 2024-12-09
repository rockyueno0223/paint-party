import express from 'express';
import userController from '../controllers/user.controller';
import { cookieAuthCheck } from '../middleware/auth';

const userRouter = express.Router();

userRouter.get('/', userController.getAllUsers);
userRouter.get('/check-auth', cookieAuthCheck, userController.checkAuth);
userRouter.post('/register', userController.registerUser);
userRouter.post('/login', userController.loginUser);
userRouter.get('/logout', userController.logoutUser);

export default userRouter;