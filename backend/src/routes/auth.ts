import express from 'express';
import userController from '../controllers/user.controller';

const userRouter = express.Router();

userRouter.get('/', userController.getAllUsers);
userRouter.post('/register', userController.registerUser);
userRouter.post('/login', userController.loginUser);

export default userRouter;