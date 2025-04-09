import { User } from '../models/users.models.js';
import { ApiError } from '../utils/ApiErrors.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ansycHandler } from '../utils/AsyncHandler.js';
import { uploadOnCloudnary } from '../utils/Cloudinary.js';

const userRegister = ansycHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;
  //   console.log(req.body);

  if (
    [fullName, email, username, password].some((field) => field?.trim() === '')
  ) {
    throw new ApiError(400, 'All Fields are required!!');
  }
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    throw new ApiError(409, 'User Already Exist!!');
  }

  const avatarFilePath = req.files?.avatar[0]?.path;

  if (!avatarFilePath) {
    throw new ApiError(400, 'Avatar is required!!');
  }

  const avatar = await uploadOnCloudnary(avatarFilePath);

  if (!avatar) {
    throw new ApiError(500, 'Something went wrong while uploading on cloud!!');
  }

  const user = await User.create({
    fullName,
    email,
    username,
    avatar: avatar.url,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    '-password -refreshToken',
  );

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, 'User register Successfully!!'));
});

export { userRegister };
