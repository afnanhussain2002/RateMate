import { Router } from "express";
import { getVideoReview } from "../controllers/clientReview.video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const clientReviewVideoRouter = Router

clientReviewVideoRouter.route("/video-review/:requestId").post(upload.fields([
    {
        name:"clientAvatar",
        maxCount:1
    },
    {
        name:"attachFile",
        maxCount:1
    },
    {
        name:"videoFile",
        maxCount:1
    }
]),getVideoReview)


export default clientReviewVideoRouter