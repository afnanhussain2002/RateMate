import { Router } from "express";
import { upload } from "../middlewares/multer.middleware";
import { registerUser } from "../controllers/user.controller";
const userRouter = Router();

userRouter.route("/register").post(upload.single("avatar"), registerUser);

export default userRouter;
