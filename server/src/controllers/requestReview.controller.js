import { RequestForReview } from "../models/requestReview.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";

const requestForReview = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content) {
    throw new ApiError(402, "Please write some content for sent request");
  }

  const sendRequest = await RequestForReview.create({
    content,
    sendBy: req.user,
  });

  const reviewRequest = await RequestForReview.findById(sendRequest._id);

  if (!reviewRequest) {
    throw new ApiError(501, "Something went wrong when send request");
  }

  res
    .status(202)
    .json(new ApiResponse(202, reviewRequest, "request send successfully"));
});

export { requestForReview };
