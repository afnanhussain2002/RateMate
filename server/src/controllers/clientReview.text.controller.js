import { ClientTextReview } from "../models/clientReview.text.model";
import userRouter from "../routes/user.routes";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";
import { uploadOnCloudinary } from "../utils/cloudinary";


const getTextReview = asyncHandler(async(req,res) =>{
    // get the request review id
//    get review from body
// validate mandatory field
// get the client avatar, and attach file, send them to the cloudinary and get the url
// save the data on database and get the data

const {requestId} = req.params

const { fullName, email, companyName, rating, description }= req.body

if (
    [fullName, email, rating, description].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "Name, Email, Rating, Description fields are required");
  }

  const clientAvatarLocalPath = req.files?.clientAvatar[0].path 
  let attachFileLocalPath 

  if (req.files.attachFile) {
    attachFileLocalPath = req.files?.attachFile[0].path
  }else{
    attachFileLocalPath =""
  }
  
  if (!clientAvatarLocalPath) {
    throw new ApiError(401, "Client avatar is required")
  }

  const clientAvatar = await uploadOnCloudinary(clientAvatarLocalPath);
  const attachFile = await uploadOnCloudinary(attachFileLocalPath)

  const textReview = await ClientTextReview.create({
    fullName,
    email,
    companyName: companyName || '',
    clientAvatar: clientAvatar.url,
    attachFile: attachFile?.url || '',
    description,
    rating
  })

  const getReview = await ClientTextReview.findById(textReview._id)

  if (!getReview) {
    throw new ApiError(501, "Something went wrong when send review")
  }

  return res.status(200).json(new ApiResponse(200, getReview, "Review send successfully"))


})

export {getTextReview}