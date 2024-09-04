import { RequestForReview } from "../models/requestReview.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// Handler for creating a request for review
const requestForReview = asyncHandler(async (req, res) => {
  // Extract content from the request body
  const { content } = req.body;

  // Check if content is provided, if not throw an error
  if (!content) {
    throw new ApiError(402, "Please write some content for sent request");
  }

  // Create a new request for review with the provided content and user
  const sendRequest = await RequestForReview.create({
    content,
    sendBy: req.user,
  });

  // Retrieve the newly created request for review by its ID
  const reviewRequest = await RequestForReview.findById(sendRequest._id);

  // Check if the request for review was successfully retrieved, if not throw an error
  if (!reviewRequest) {
    throw new ApiError(501, "Something went wrong when send request");
  }

  // Send a response with status 202 and the review request data
  res
    .status(202)
    .json(new ApiResponse(202, reviewRequest, "request send successfully"));
});


export { requestForReview };
