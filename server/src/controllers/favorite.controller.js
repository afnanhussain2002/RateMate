import { Favorite } from "../models/favorite.model";
import { ApiError } from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";

const favoriteTextReviews = asyncHandler(async(req,res) =>{
  const textReviewId = req.params

  if (!textReviewId) {
    throw new ApiError(400, "Select the text review");
  }

  const findTextReview = await Favorite.findById(textReviewId)

  


})

export {favoriteTextReviews}