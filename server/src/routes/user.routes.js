import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { registerUser } from "../controllers/user.controller.js";
const userRouter = Router();

userRouter.route("/register").post(upload.single("avatar"), registerUser);

export default userRouter;
