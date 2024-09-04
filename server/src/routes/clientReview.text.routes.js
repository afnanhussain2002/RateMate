import { Router } from "express";
import { getTextReview } from "../controllers/clientReview.text.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const clientReviewTextRouter = Router()

clientReviewTextRouter.route("/text-review").post(upload.fields([
    {
        name:"clientAvatar",
        maxCount:1
    },
    {
        name:"attachFile",
        maxCount:1
    }
]),getTextReview)

export default clientReviewTextRouter