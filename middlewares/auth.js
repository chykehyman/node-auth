import jwt from 'jsonwebtoken';
import ErrorResponse from '../utils/ErrorResponse';
import User from '../models/user'

export default async (req, res, next) => {
  const token = req.headers.authorization
    ? req.headers.authorization.split(' ')[1]
    : null;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        next(
          new ErrorResponse(
            'Authentication failed. Token is invalid or expired',
            401
          )
        );
      } else {
        const user = await User.findById(decoded.id);
        if (!user) return next(new ErrorResponse(`User with id: ${decoded.id}`, 404));
        req.user = user;
        next();
      }
    });
  } else next(new ErrorResponse('Access denied. Token is required', 403));
};
