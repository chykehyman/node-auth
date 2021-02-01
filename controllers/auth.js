import crypto from 'crypto';
import User from '../models/user';
import ErrorResponse from '../utils/ErrorResponse';
import sendEmail from '../utils/sendMail';

export const register = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.create({ username, email, password });
    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new ErrorResponse('Please provide email and password', 400));

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) return next(new ErrorResponse('Invalid credentials', 401));

    const isMatch = await user.matchPasswords(password);
    if (!isMatch) return next(new ErrorResponse('Invalid credentials', 401));

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return next(new ErrorResponse('Email could not be sent', 404));

    const resetToken = user.getResetPasswordToken();

    await user.save();
    const resetUrl = `${req.protocol}://localhost:3000}/password-reset/${resetToken}`;

    const message = `
      <h1>You have requested a password reset<h1>
      <p>Please go to this link to reset your password</p>
      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    `;

    try {
      sendEmail({
        to: user.email,
        subject: 'Password Reset Request',
        html: message,
      });

      res.status(200).json({
        success: true,
        message: 'Password recovery email has been sent',
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      next(new ErrorResponse('Password recovery email could not be sent', 500));
    }
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) next(new ErrorResponse('Invalid Reset Token', 400));
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    res.status(200).json({
      success: true,
      message: 'Password reset success',
    });
  } catch (error) {
    next(error);
  }
};

const sendTokenResponse = (user, statusCode, res) => {
  res.status(statusCode).json({
    success: true,
    token: user.getSignedToken(),
  });
};
