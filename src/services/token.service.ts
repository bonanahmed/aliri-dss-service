import jwt from 'jsonwebtoken';
import moment from 'moment';
import httpStatus from 'http-status';
import config from '../config/config';
import * as authService from './auth.service';
import { Token } from '../models/token';
import ApiError from '../utils/ApiError';
import { tokenTypes } from '../config/tokens';
import { IAccountDocument } from '../models/account/mongoose';

/**
 * Generate token
 * @param {ObjectId} accountId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (
  accountId: string,
  expires: moment.Moment,
  type: string,
  secret: string = config.jwt.secret
): string => {
  const payload = {
    sub: accountId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} accountId
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
const saveToken = async (
  token: string,
  account: string,
  expires: moment.Moment,
  type: string,
  blacklisted: boolean = false
): Promise<any> => {
  const tokenDoc = await Token.create({
    token,
    account_id: account,
    expires: expires.toDate(),
    type,
    blacklisted,
  });
  return tokenDoc;
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
const verifyToken = async (token: string, type: string): Promise<any> => {
  const payload: any = jwt.verify(token, config.jwt.secret);
  const tokenDoc = await Token.findOne({
    token,
    type,
    user: payload.sub,
    blacklisted: false,
  });
  if (!tokenDoc) {
    throw new Error('Token not found');
  }
  return tokenDoc;
};

/**
 * Generate auth tokens
 * @param {IAccountDocument} account
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (account: IAccountDocument): Promise<any> => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = generateToken(account.id, accessTokenExpires, tokenTypes.ACCESS);

  const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
  const refreshToken = generateToken(account.id, refreshTokenExpires, tokenTypes.REFRESH);
  await saveToken(refreshToken, account.id, refreshTokenExpires, tokenTypes.REFRESH);

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

/**
 * Generate reset password token
 * @param {string} username
 * @returns {Promise<string>}
 */
const generateResetPasswordToken = async (username: string): Promise<string> => {
  const account = await authService.getAccountByUsername(username);
  if (!account) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No accounts found with this email');
  }
  const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
  const resetPasswordToken = generateToken(account.id, expires, tokenTypes.RESET_PASSWORD);
  await saveToken(resetPasswordToken, account.id, expires, tokenTypes.RESET_PASSWORD);
  return resetPasswordToken;
};

/**
 * Generate verify email token
 * @param {Account} account
 * @returns {Promise<string>}
 */
const generateVerifyEmailToken = async (account: IAccountDocument): Promise<string> => {
  const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
  const verifyEmailToken = generateToken(account.id, expires, tokenTypes.VERIFY_EMAIL);
  await saveToken(verifyEmailToken, account.id, expires, tokenTypes.VERIFY_EMAIL);
  return verifyEmailToken;
};

export { generateToken, saveToken, verifyToken, generateAuthTokens, generateResetPasswordToken, generateVerifyEmailToken };
