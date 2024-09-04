import asyncHandler from "../utils/asyncHandler";


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
  const attachFileLocalPath = req.files?.attachFile[0].path
  
  



})

export {getTextReview}