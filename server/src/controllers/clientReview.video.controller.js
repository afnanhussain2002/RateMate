
import { ClientVideoReview } from "../models/clientReview.video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


// Handle the submission of text review
const getVideoReview = asyncHandler(async (req, res) => {
    const { requestId } = req.params;
  
    const { fullName, email, companyName, rating, description } = req.body;
  
    if (
      [fullName, email, rating, description].some((field) => field?.trim() === "")
    ) {
      throw new ApiError(
        400,
        "Name, Email, Rating, Description fields are required"
      );
    }
  
    const clientAvatarLocalPath = req.files?.clientAvatar[0].path;
    const videoReviewLocalPath = req.files?.videoFile[0].path;
    let attachFileLocalPath;
  
    if (req.files.attachFile) {
      attachFileLocalPath = req.files?.attachFile[0].path;
    } else {
      attachFileLocalPath = "";
    }
  
    if (!clientAvatarLocalPath) {
      throw new ApiError(401, "Client avatar is required");
    }

    if (!videoReviewLocalPath) {
        throw new ApiError(401, "video file is required")
    }
  
    const clientAvatar = await uploadOnCloudinary(clientAvatarLocalPath);
    const videoFile = await uploadOnCloudinary(videoReviewLocalPath)
    const attachFile = await uploadOnCloudinary(attachFileLocalPath);
  
    const videoReview = await ClientVideoReview.create({
      fullName,
      email,
      companyName: companyName || "",
      clientAvatar: clientAvatar.url,
      attachFile: attachFile?.url || "",
      videoFile,
      description,
      rating,
      reviewFor: requestId,
    });
  
    const getReview = await ClientVideoReview.findById(videoReview._id);
  
    if (!getReview) {
      throw new ApiError(501, "Something went wrong when send review");
    }
  
    return res
      .status(200)
      .json(new ApiResponse(200, getReview, "Review send successfully"));
  });
  
  export { getVideoReview };