import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

/**
 * Generates access and refresh tokens for a user.
 *
 * @param {string} userId - The ID of the user for whom the tokens are being generated.
 * @returns {Object} - An object containing the access token and refresh token.
 * @throws {ApiError} - Throws an error if token generation fails.
 */
const generateAccessAndRefreshToken = async (userId) => {
  try {
    // Find the user by their ID
    const user = await User.findById(userId);

    // Generate an access token for the user
    const accessToken = user.generateAccessToken();

    // Generate a refresh token for the user
    const refreshToken = user.generateRefreshToken();

    // Save the refresh token to the user's record in the database
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
console.log('Access token', accessToken,"refreshToken" ,refreshToken);
    // Return the generated tokens
    return { accessToken, refreshToken };
  } catch (error) {
    // Throw an error if something goes wrong during token generation
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

/**
 * Registers a new user.
 *
 * This function handles the registration of a new user by performing the following steps:
 * 1. Extracts user details (fullName, email, username, password) from the request body.
 * 2. Validates that none of the required fields are empty.
 * 3. Checks if a user with the same email or username already exists in the database.
 * 4. Validates the presence of an avatar file in the request.
 * 5. Uploads the avatar file to Cloudinary.
 * 6. Creates a new user in the database with the provided details and the URL of the uploaded avatar.
 * 7. Retrieves the newly created user from the database, excluding the password and refreshToken fields.
 * 8. Returns a success response with the created user details.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @throws {ApiError} - Throws an error if any validation fails or if something goes wrong during user registration.
 */
const registerUser = asyncHandler(async (req, res) => {
  // Extract user details from the request body
  const { fullName, email, username, password } = req.body;

  // Validate that none of the required fields are empty
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  console.log(fullName, email, username, password);

  // Check if a user with the same email or username already exists
  const existUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  // Validate the presence of an avatar file in the request
  const avatarLocalPath = req.file?.path;
  console.log(avatarLocalPath);

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // Upload the avatar file to Cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  console.log(avatar);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  // Create a new user in the database
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    email,
    password,
    username: username.toLowerCase(),
  });

  // Retrieve the newly created user, excluding the password and refreshToken fields
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong when registering the user");
  }

  // Return a success response with the created user details
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

// Function to handle user login
const loginUser = asyncHandler(async (req, res) => {
  // Extract username, email, and password from the request body
  const { username, email, password } = req.body;

  // Check if either username or email is provided
  if (!(username || email)) {
    throw new ApiError(400, "username or email is required");
  }

  // Find the user by username or email
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  // If user does not exist, throw an error
  if (!user) {
    throw new ApiError(400, "user does not exist");
  }

  // Validate the provided password
  const isPasswordValid = await user.isCorrectPassword(password);

  // If password is invalid, throw an error
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  // Generate access and refresh tokens for the user
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  // Retrieve the logged-in user's details excluding password and refreshToken
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // Set cookie options
  const options = {
    httpOnly: true, // Cookie is accessible only by the web server
    secure: true, // Cookie is sent only over HTTPS
  };

  // Send response with user details and tokens, and set cookies
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User login successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };
  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const refreshAccessToken = asyncHandler(async(req,res) =>{
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
  
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request")
  }
})

export { registerUser, loginUser, logoutUser, refreshAccessToken };
