import mongoose, { Schema } from "mongoose";

const favoriteSchema = new Schema({
     textReview:[{
        type: Schema.Types.ObjectId,
        ref:"ClientText"
     }],
     videoReview:[{
        type: Schema.Types.ObjectId,
        ref:"ClientVideo"
     }],
     owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
     }
},{timestamps:true})


export const Favorite = mongoose.model("Favorite", favoriteSchema)