import mongoose, { Schema } from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
const userSchema = new Schema({

    username:{
        type:String,
        unique: true,
        lowercase:true,
        trim:true,
        index:true,
        required: true
    },
    fullName:{
        type:String,
        required: true
    },
    email:{
        type:String,
        unique: true,
        lowercase:true,
        trim:true,
        required: true
    },
    password:{
        type:String,
        required: true
    },
    avatar:{
        type:String,
        required: true
    },
    refreshToken:{
       type:String
    }

}, {timestamps:true})

userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next()
  this.password = bcrypt.hash(this.password,10)
  next()
})


export const User = mongoose.model("User", userSchema)