import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import { authService, userService, tokenService, emailService } from '../services';
import { IAccountDocument } from '../models/account/mongoose';
import ApiResponse from '../utils/ApiResponse';

const register = catchAsync(async (req: Request, res: Response) => {
  const { body } = req;
  const account = await authService.registerAccount(body);
  const user = await userService.createUser({
    account_id: account.id,
  });
  const tokens = await tokenService.generateAuthTokens(account);
  ApiResponse(res, httpStatus.CREATED, 'register success', {
    account,
    user,
    tokens,
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const account = await authService.loginWithUsernameAndPassword(username, password);
  const tokens = await tokenService.generateAuthTokens(account);
  // res.send({ account, tokens });
  ApiResponse(res, httpStatus.OK, 'login success', {
    account,
    tokens,
  });
});

const logout = catchAsync(async (req: Request, res: Response) => {
  await authService.logout(req.body.refreshToken);
  // res.status(httpStatus.NO_CONTENT).send();
  ApiResponse(res, httpStatus.NO_CONTENT, 'logout success');
});

const refreshTokens = catchAsync(async (req: Request, res: Response) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  // res.send({ ...tokens });
  ApiResponse(res, httpStatus.OK, httpStatus[200], {
    tokens,
  });
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const { body } = req;
  const { email } = body;
  const resetPasswordToken = await tokenService.generateResetPasswordToken(email);
  await emailService.sendResetPasswordEmail(email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
  ApiResponse(res, httpStatus.NO_CONTENT, 'create reset token success');
});

const resetPassword = catchAsync(async (req, res) => {
  const token = req.query.token as string | undefined;

  if (token === undefined) {
    // Handle the case where the token is not defined, e.g., return an error response.
    res.status(httpStatus.BAD_REQUEST).json({ error: 'Token is missing' });
    return;
  }

  await authService.resetPassword(token, req.body.password);
  // res.status(httpStatus.NO_CONTENT).send();
  ApiResponse(res, httpStatus.NO_CONTENT, 'reset password success');
});

const sendVerificationEmail = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IAccountDocument;
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(user);
  await emailService.sendVerificationEmail(user!.email!, verifyEmailToken);
  // res.status(httpStatus.NO_CONTENT).send();
  ApiResponse(res, httpStatus.NO_CONTENT, 'send email verification success');
});

const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const token = req.query.token as string;
  await authService.verifyEmail(token);
  // res.status(httpStatus.NO_CONTENT).send();
  ApiResponse(res, httpStatus.NO_CONTENT, 'verify email success');
});

export { login, register, logout, refreshTokens, forgotPassword, resetPassword, sendVerificationEmail, verifyEmail };
