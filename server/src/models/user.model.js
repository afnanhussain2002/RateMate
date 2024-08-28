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
  this.password = await bcrypt.hash(this.password,10)
  next()
})

userSchema.methods.isCorrectPassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    jwt.sign(
        {
            _id:this._id
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
           expiresIn: process.env.ACCESS_TOKEN_EXPIRED
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    jwt.sign(
        {
            _id:this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
           expiresIn: process.env.REFRESH_TOKEN_EXPIRED
        }
    )
}


export const User = mongoose.model("User", userSchema)