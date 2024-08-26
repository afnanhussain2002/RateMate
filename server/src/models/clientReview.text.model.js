import mongoose, { Schema, SchemaType } from "mongoose";

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
    avatar:{
        type:String,
        required: true
    },
    rating:{
        type:Number,
        required:true
    },
    description:{
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

export const ClientText = mongoose.model("ClientText", clientTextReviewSchema)