import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import { Account } from '../models/account';
import { tokenService } from '.';
import { Token } from '../models/token';
import { tokenTypes } from '../config/tokens';
import bcrypt from 'bcrypt';
import { IAccountDocument } from '../models/account/mongoose';
/**
 * Login with username and password
 * @param {string} username
 * @param {string} password
 * @returns {Promise<IAccountDocument>}
 */
const loginWithUsernameAndPassword = async (username: string, password: string): Promise<IAccountDocument> => {
  console.log('password', password);
  const account = await Account.findOne({ username: username });
  const passwordIsMatch = await bcrypt.compare(password, account?.password ?? '');
  if (!account || !passwordIsMatch || !password) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }

  return account;
};

/**
 * Create a user
 * @param {Object} accountBody
 * @returns {Promise<any>}
 */
const registerAccount = async (accountBody: any): Promise<any> => {
  if (await Account.isUsernameTaken(accountBody.username)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Username already taken');
  }
  return await Account.create(accountBody);
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken: string): Promise<void> => {
  const refreshTokenDoc = await Token.findOne({
    token: refreshToken,
    type: tokenTypes.REFRESH,
    blacklisted: false,
  });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.deleteOne({ token: refreshTokenDoc.token });
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken: string): Promise<{ access: any; refresh: any }> => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const account = await Account.findById(refreshTokenDoc.account);
    if (!account) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    const tokens = await tokenService.generateAuthTokens(account);
    return tokens;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise<void>}
 */
const resetPassword = async (resetPasswordToken: string, newPassword: string): Promise<void> => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
    const account = await Account.findById(resetPasswordTokenDoc.account);
    if (!account) {
      throw new Error();
    }
    await Account.updateOne(account.id, { password: newPassword });
    await Token.deleteMany({
      account: account.id,
      type: tokenTypes.RESET_PASSWORD,
    });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise<void>}
 */
const verifyEmail = async (verifyEmailToken: string): Promise<void> => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
    const user = await Account.findById(verifyEmailTokenDoc.account);
    if (!user) {
      throw new Error();
    }
    await Token.deleteMany({
      user: user.id,
      type: tokenTypes.VERIFY_EMAIL,
    });
    await Account.updateOne({ _id: user.id }, { isEmailVerified: true });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};

/**
 * Get user by username
 * @param {string} username
 * @returns {Promise<User>}
 */
const getAccountByUsername = async (username: string): Promise<IAccountDocument | null> => {
  return await Account.findOne({ username });
};

export {
  loginWithUsernameAndPassword,
  registerAccount,
  logout,
  refreshAuth,
  verifyEmail,
  resetPassword,
  getAccountByUsername,
};
