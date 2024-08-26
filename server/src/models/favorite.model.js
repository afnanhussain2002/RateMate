import mongoose, { Schema } from "mongoose";

const favoriteSchema = new Schema({
     
},{timestamps:true})


export const Favorite = mongoose.model("Favorite", favoriteSchema)