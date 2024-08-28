import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";


const registerUser = asyncHandler(async(req,res) =>{
 const {fullName, email, username, password} = req.body;

 if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existUser = await User.findOne({
    $or:[{username}, {email}]
  })

  if (existUser) {
    throw new ApiError(409, "User with email or username already exists");
  }




})

export{registerUser}