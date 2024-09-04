import Router from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { requestForReview } from "../controllers/requestReview.controller.js";

const requestReviewRouter = Router()

requestReviewRouter.route("/request-review").post(verifyJWT,requestForReview)

export default requestReviewRouter;