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
    avatar:{
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
    avatar:{
        type:String,
    },
    reviewFor:{
        type: Schema.Types.ObjectId,
        ref:"User"
    }

}, {timestamps:true})

export const ClientVideo = mongoose.model("ClientVideo", clientVideoReviewSchema)