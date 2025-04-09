import jwt from 'jsonwebtoken';
import { ansycHandler } from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiErrors.js';
import { User } from '../models/users.models.js';

const verifyJWT = ansycHandler(async (req, res, next) => {
  try {
    const token =
      req.cookie?.accessToken ||
      req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new ApiError(401, 'Unauthorized Access!!');
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(404, 'User not Exist!!');
    }
    req.user = user;
    next();
  } catch (error) {
    console.log('Unauthorize access', error);
  }
});

export { verifyJWT };
