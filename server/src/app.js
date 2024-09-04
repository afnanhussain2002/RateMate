import express from "express"
import cors from "cors"
import cookieParser from 'cookie-parser';


const app = express()
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit:'16kb'}))
app.use(express.urlencoded({extended:true, limit:'16kb'}))
app.use(express.static('public'))
app.use(cookieParser())

import userRouter from "./routes/user.routes.js";
import requestReviewRouter from "./routes/requestReview.routes.js";
import clientReviewTextRouter from "./routes/clientReview.text.routes.js";
import clientReviewVideoRouter from "./routes/clientReview.video.routes.js";


// routes declaration

app.use("/api/v1/users", userRouter)
app.use("/api/v1/send", requestReviewRouter)
app.use("/api/v1/clientText", clientReviewTextRouter)
app.use("/api/v1/clientVideo", clientReviewVideoRouter)

export {app}