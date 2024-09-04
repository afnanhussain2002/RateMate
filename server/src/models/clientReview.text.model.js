import mongoose, { Schema } from "mongoose";

const clientTextReviewSchema = new Schema({

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
   
    rating:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    clientAvatar:{
        type:String,
        required:true
    },
    attachFile:{
        type:String,
    },
    reviewFor:{
        type: Schema.Types.ObjectId,
        ref:"RequestForReview"
    }

}, {timestamps:true})

export const ClientTextReview = mongoose.model("ClientTextReview", clientTextReviewSchema)