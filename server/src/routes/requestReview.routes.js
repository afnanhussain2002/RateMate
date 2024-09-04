import Router from "express"
import { verifyJWT } from "../middlewares/auth.middleware";
import { requestForReview } from "../controllers/requestReview.controller";

const requestReviewRouter = Router()

requestReviewRouter.route("/request-review").post(verifyJWT,requestForReview)

export default requestReviewRouter;