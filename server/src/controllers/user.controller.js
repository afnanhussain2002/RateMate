import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

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
    console.log("Access token", accessToken, "refreshToken", refreshToken);
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

// Handler to log out a user
const logoutUser = asyncHandler(async (req, res) => {
  // Find the user by their ID and unset the refreshToken field
  await User.findByIdAndUpdate(
    req.user._id, // User ID from the request object
    {
      $unset: {
        refreshToken: 1, // Remove the refreshToken field from the user document
      },
    },
    { new: true } // Return the updated document
  );

  // Options for clearing cookies
  const options = {
    httpOnly: true, // Ensure the cookie is only accessible by the web server
    secure: true, // Ensure the cookie is sent over HTTPS
  };

  // Clear the accessToken and refreshToken cookies and send a response
  res
    .status(200) // Set the status code to 200 (OK)
    .clearCookie("accessToken", options) // Clear the accessToken cookie
    .clearCookie("refreshToken", options) // Clear the refreshToken cookie
    .json(new ApiResponse(200, {}, "User logged Out")); // Send a JSON response indicating the user has logged out
});

// Function to refresh the access token using an incoming refresh token
const refreshAccessToken = asyncHandler(async (req, res) => {
  // Retrieve the refresh token from cookies or request body
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  // If no refresh token is provided, throw an unauthorized error
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    // Verify the incoming refresh token using the secret key
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    // Find the user associated with the decoded token's user ID
    const user = await User.findById(decodedToken?._id);

    // If no user is found, throw an invalid refresh token error
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    // If the incoming refresh token does not match the user's stored refresh token, throw an error
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired to used");
    }

    // Options for setting cookies
    const options = {
      httpOnly: true, // Cookie is only accessible by the web server
      secure: true, // Cookie is only sent over HTTPS
    };

    // Generate new access and refresh tokens
    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    // Set the new tokens as cookies and send a JSON response
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken: newRefreshToken,
          },
          "Access token refreshed"
        )
      );
  } catch (error) {
    // If any error occurs, throw an unauthorized error with the error message
    throw new ApiError(401, error.message || "Invalid Refresh Token");
  }
});

// Function to handle password change request
const changeCurrentPassword = asyncHandler(async (req, res) => {
  // Extract old and new passwords from the request body
  const { oldPassword, newPassword } = req.body;

  // Find the user by their ID, which is stored in the request object
  const user = await User.findById(req.user?._id);

  // Check if the provided old password is correct
  const isPasswordCorrect = await user.isCorrectPassword(oldPassword);

  // If the old password is incorrect, throw an error
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid password");
  }

  // Update the user's password with the new password
  user.password = newPassword;

  // Save the updated user object to the database without running validation
  await user.save({ validateBeforeSave: false });

  // Return a success response with a status code of 201
  return res
    .status(201)
    .json(new ApiResponse(201, {}, "Password change successfully"));
});

// Define an asynchronous function to get the current user
const getCurrentUser = asyncHandler(async (req, res) => {
  // Return a successful response with the user data and a success message
  return res
    .status(200) // Set the HTTP status code to 200 (OK)
    .json(new ApiResponse(200, req.user, "User fetched successfully")); // Send a JSON response with the user data and a success message
});

const updateAccountDetails = asyncHandler(async(req,res)=>{
  const {fullName, email} = req.body;

  if (!(fullName || email)) {
    throw new ApiError (400, "Write something for update account details")
  }

  const user = await User.findByIdAndUpdate(
    req.user?.id,
    {
      fullName,
      email
    },
    {new:true}
  ).select("-password")

  return res.status(202).json(new ApiResponse(202, user, "Account details update successfully"))
})

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails
};
