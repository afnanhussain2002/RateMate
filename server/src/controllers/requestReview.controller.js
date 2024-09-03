import { RequestForReview } from "../models/requestReview.model";
import { ApiError } from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";

const requestForReview = asyncHandler(async(req,res) =>{

  const {content} =  req.body

  if (!content) {
    throw new ApiError(402, "Please write some content for sent request")
  }

  const sendRequest = await RequestForReview.create({
    content,
    sendBy:req.user
  })

})

export {requestForReview}