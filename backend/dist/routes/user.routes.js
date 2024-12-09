"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const auth_1 = require("../middleware/auth");
const userRouter = express_1.default.Router();
userRouter.get('/', user_controller_1.default.getAllUsers);
userRouter.get('/check-auth', auth_1.cookieAuthCheck, user_controller_1.default.checkAuth);
userRouter.post('/register', user_controller_1.default.registerUser);
userRouter.post('/login', user_controller_1.default.loginUser);
userRouter.get('/logout', user_controller_1.default.logoutUser);
exports.default = userRouter;
