import { ApiError } from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";

export const verifyJWT = asyncHandler(async(req,res) =>{
    try {
        
    } catch (error) {
       throw new ApiError(401, error?.message || "Invalid access token") 
    }
})