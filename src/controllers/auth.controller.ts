import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import { authService, userService, tokenService, emailService } from '../services';
import { IAccountDocument } from '../models/account/mongoose';
import ApiResponse from '../utils/ApiResponse';
import config from '../config/config';
import { Configuration } from '../models/configuration';

export const register = catchAsync(async (req: Request, res: Response) => {
  const { body } = req;
  const account = await authService.registerAccount(body);
  const user = await userService.createUser({
    account_id: account.id,
  });
  const tokens = await tokenService.generateAuthTokens(account);
  ApiResponse(res, httpStatus.CREATED, 'Daftar Berhasil', {
    account,
    user,
    tokens,
  });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const account = await authService.loginWithUsernameAndPassword(username, password);
  const tokens = await tokenService.generateAuthTokens(account);
  const cookiesOption: any = {
    maxAge: 86400000,
    httpOnly: true,
  };
  if (config.run_mode === 'production') cookiesOption.domain = '.airso.id';
  res.cookie('access_token', tokens.access.token, cookiesOption);
  ApiResponse(res, httpStatus.OK, 'Login Berhasil', {
    account,
    tokens,
  });
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IAccountDocument;
  await authService.logout(user?.id);
  const cookiesOption: any = {
    httpOnly: true,
  };
  if (config.run_mode === 'production') cookiesOption.domain = '.airso.id';
  res.clearCookie('access_token', cookiesOption);
  ApiResponse(res, httpStatus.OK, 'Logout Berhasil');
});

export const refreshTokens = catchAsync(async (req: Request, res: Response) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  ApiResponse(res, httpStatus.OK, httpStatus[200], {
    tokens,
  });
});

export const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const { body } = req;
  const { email } = body;
  const resetPasswordToken = await tokenService.generateResetPasswordToken(email);
  await emailService.sendResetPasswordEmail(email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
  ApiResponse(res, httpStatus.NO_CONTENT, 'create reset token success');
});

export const resetPassword = catchAsync(async (req, res) => {
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

export const sendVerificationEmail = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IAccountDocument;
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(user);
  await emailService.sendVerificationEmail(user!.email!, verifyEmailToken);
  // res.status(httpStatus.NO_CONTENT).send();
  ApiResponse(res, httpStatus.NO_CONTENT, 'send email verification success');
});

export const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const token = req.query.token as string;
  await authService.verifyEmail(token);
  // res.status(httpStatus.NO_CONTENT).send();
  ApiResponse(res, httpStatus.NO_CONTENT, 'verify email success');
});

export const getData = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IAccountDocument;
  const configuration = await Configuration.find();
  // const getRolesRight = await rolesRight(user?.role);
  const obj: any = {};
  configuration.forEach((item: any, inde: number) => {
    obj[item.key] = {
      label: item.label,
      value: item.value,
    };
  });
  ApiResponse(res, httpStatus.OK, httpStatus[200], { user, configuration: obj });
});
