import mongoose, { Schema } from "mongoose";

const reviewBundleSchema = new Schema({
     name:{
        type:String,
        required:true,
     },
     description:{
        type:String,
        required:true
     },
     textReviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"ClientText"
        }
     ],
     videoReviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"ClientVideo"
        }
     ],
     owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
     }

},{timestamps:true})

export const ReviewBundle = mongoose.model("ReviewBundle", reviewBundleSchema)