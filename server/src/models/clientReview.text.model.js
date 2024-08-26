import mongoose, { Schema } from "mongoose";

const clientTextReviewSchema = new Schema({

}, {timestamps:true})

export const ClientText = mongoose.model("ClientText", clientTextReviewSchema)