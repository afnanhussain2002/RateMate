import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema({
    message:{
        type:String,
    },
    isRead:{
        type:Boolean,
        default:false
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})

export const Notification = mongoose.model("Notification", notificationSchema)