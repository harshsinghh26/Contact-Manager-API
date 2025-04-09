import jwt from 'jsonwebtoken';
import { ansycHandler } from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiErrors.js';
import { User } from '../models/users.models.js';

const verifyJWT = ansycHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new ApiError(401, 'Unauthorized Access!!');
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      '-password -refreshToken',
    );
    if (!user) {
      throw new ApiError(404, 'User not Exist!!');
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || 'Inavlid Access');
  }
});

export { verifyJWT };
