import mongoose, { Schema } from "mongoose";


const requestForReviewSchema = new Schema({

    content:{
        type:String,
        required:true
    },
    sendBy:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }

    

},{timestamps:true})

export const RequestForReview = mongoose.model("RequestForReview", requestForReviewSchema)