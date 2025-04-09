import { User } from '../models/users.models.js';
import { ApiError } from '../utils/ApiErrors.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ansycHandler } from '../utils/AsyncHandler.js';
import { uploadOnCloudnary } from '../utils/Cloudinary.js';

// Generate Tokens

const generateTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.createAccessToken();
    const refreshToken = user.createRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, `Something went wrong while generating tokens!!`);
  }
};

// User Registration

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
    throw new ApiError(409, 'User with the email or username Already Exist!!');
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

// User login

const userLogin = ansycHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!(email || username)) {
    throw new ApiError(400, 'Username or email is required!!');
  }

  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    throw new ApiError(404, 'User with the email or username not exist!!');
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, 'Wrong user Credentials!!');
  }

  const { accessToken, refreshToken } = await generateTokens(user._id);

  const loggedInUser = await User.findById(user._id).select(
    '-password -refreshToken',
  );

  if (!loggedInUser) {
    throw new ApiError(500, 'Server Error!!');
  }

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, refreshToken, accessToken },
        'User logged In Successfully!!',
      ),
    );
});

// User Log Out

const userLogout = ansycHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    { new: true },
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json(new ApiResponse(200, {}, 'User logged Out Successfully!!'));
});

export { userRegister, userLogin, userLogout };
