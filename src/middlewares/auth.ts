import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import { roleRights } from '../config/roles';
import { IAccountDocument } from '../models/account/mongoose';

const verifyCallback =
  (req: Request, resolve: () => void, reject: (error: ApiError) => void) =>
  async (err: Error, user: IAccountDocument, info: any) => {
    if (err || info || !user) {
      return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
    }
    req.user = user;

    resolve();
  };

const auth = () => async (req: Request, res: Response, next: NextFunction) => {
  return new Promise<void>((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject))(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};

export default auth;
