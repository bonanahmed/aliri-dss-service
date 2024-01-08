import { Request, Response } from 'express';
import httpStatus from 'http-status';
import pick from '../utils/pick';
import catchAsync from '../utils/catchAsync';
import { accountService, authService, tokenService, userService } from '../services';
import ApiResponse from '../utils/ApiResponse';
import ApiError from '../utils/ApiError';

const createUserAndAccount = catchAsync(async (req: Request, res: Response) => {
  const { body } = req;
  const account = await authService.registerAccount({
    ...body,
    password: 'Password12345678',
  });
  const user = await userService.createUser({
    account_id: account.id,
    ...body,
  });
  const tokens = await tokenService.generateAuthTokens(account);
  ApiResponse(res, httpStatus.CREATED, 'Data Berhasil Dibuat', {
    account,
    user,
    tokens,
  });
});

const getUsersAndAccounts = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['search']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const accounts = await accountService.getAccountsAndUsers(filter, options);
  // res.send(result);
  ApiResponse(res, httpStatus.OK, httpStatus[200], accounts);
});

const getUserAndAccount = catchAsync(async (req, res) => {
  const result = await accountService.getAccountAndUserById(req.params.id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  ApiResponse(res, httpStatus.OK, httpStatus[200], result);
});

const updateUserAndAccount = catchAsync(async (req, res) => {
  const account = await accountService.updateAccountAndUserById(req.params.id, req.body);
  ApiResponse(res, httpStatus.OK, 'Data Berhasil Diupdate', { account });
});

const deleteUserAndAccount = catchAsync(async (req, res) => {
  const account = await accountService.deleteAccountAndUser(req.params.id);
  // res.status(httpStatus.NO_CONTENT).send();
  ApiResponse(res, httpStatus.OK, 'Data Berhasil Dihapus', account);
});

export { createUserAndAccount, getUserAndAccount, getUsersAndAccounts, updateUserAndAccount, deleteUserAndAccount };
