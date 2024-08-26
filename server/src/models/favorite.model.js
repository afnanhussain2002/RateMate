import mongoose, { Schema } from "mongoose";

const favoriteSchema = new Schema({
     textReview:{
        type: Schema.Types.ObjectId,
        ref:"ClientText"
     },
     videoReview:{
        type: Schema.Types.ObjectId,
        ref:"ClientVideo"
     }
},{timestamps:true})


export const Favorite = mongoose.model("Favorite", favoriteSchema)