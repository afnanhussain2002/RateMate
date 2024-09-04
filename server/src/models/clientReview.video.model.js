import mongoose, { Schema } from "mongoose";

const clientVideoReviewSchema = new Schema({

    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique: true,
        lowercase:true,
        trim:true,
        required: true
    },
    companyName:{
      type:String
    },
    clientAvatar:{
        type:String,
        required: true
    },
    rating:{
        type:Number,
        required:true
    },
    videoFile:{
        type:String,
        required:true
    },
    attachFile:{
        type:String,
    },
    reviewFor:{
        type: Schema.Types.ObjectId,
        ref:"User"
    }

}, {timestamps:true})

export const ClientVideoReview = mongoose.model("ClientVideoReview", clientVideoReviewSchema)