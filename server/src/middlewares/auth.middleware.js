import { ApiError } from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";

export const verifyJWT = asyncHandler(async(req,res) =>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
    } catch (error) {
       throw new ApiError(401, error?.message || "Invalid access token") 
    }
})