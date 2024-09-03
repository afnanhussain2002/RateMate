import mongoose, { Schema } from "mongoose";


const requestForReviewSchema = new Schema({

},{timestamps:true})

export const RequestForReview = mongoose.model("RequestForReview", requestForReviewSchema)