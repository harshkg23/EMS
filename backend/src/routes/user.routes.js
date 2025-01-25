import express from 'express';
import { loginUser, registerUser, createEmployee, updateEmployee, deleteEmployee, getAllEmployees } from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import authMiddleware from "../middlewares/auth.middleware.js";
import  roleMiddleware  from '../middlewares/role.middleware.js';

const userRouter = express.Router();

userRouter.post('/login', loginUser);
userRouter.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    }
  ]),
  registerUser
);

userRouter.route("/create").post(
  authMiddleware,
  roleMiddleware(["Admin", "Manager"]),
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    }
  ]),
  createEmployee
);

userRouter.route("/update/:employeeId").put(
  authMiddleware,
  roleMiddleware(["Admin", "Manager"]),
  updateEmployee
);

userRouter.route("/delete").delete(
  authMiddleware,
  roleMiddleware(["Admin", "Manager"]),
  deleteEmployee
);

userRouter.route("/employee").get(
  getAllEmployees
);


export default userRouter;