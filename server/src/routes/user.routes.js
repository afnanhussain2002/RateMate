import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { changeCurrentPassword, loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const userRouter = Router();

userRouter.route("/register").post(upload.single("avatar"), registerUser);
userRouter.route("/login").post(loginUser)
userRouter.route("/logout").post(verifyJWT,logoutUser)
userRouter.route("refresh-token").post(refreshAccessToken)
userRouter.route("/change-password").post(verifyJWT, changeCurrentPassword)

export default userRouter;
