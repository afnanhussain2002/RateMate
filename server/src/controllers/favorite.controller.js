import { Favorite } from "../models/favorite.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";

const favoriteTextReviews = asyncHandler(async(req,res) =>{
  const textReviewId = req.params

  if (!textReviewId) {
    throw new ApiError(400, "Select the text review");
  }

  const findTextReview = await Favorite.findOne({
    textReview: textReviewId,
    owner: req.user._id
  })

  if (findTextReview) {
    await Favorite.findByIdAndDelete(findTextReview._id)
    return res.status(200).json(new ApiResponse(200, {}, "Text review deleted successfully"))
  }

  const newFavorite = await Favorite({
 textReview: textReviewId,
 owner: req.user._id

})
await newFavorite.save()
return res.status(200).json(new ApiResponse(200, newFavorite, "Text review added successfully"))

})

export {favoriteTextReviews}