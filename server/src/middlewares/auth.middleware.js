import { ApiError } from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler(async(req,res) =>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")

        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }

        const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    } catch (error) {
       throw new ApiError(401, error?.message || "Invalid access token") 
    }
})