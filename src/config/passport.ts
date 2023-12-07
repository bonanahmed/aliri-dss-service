import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import config from './config';
import { tokenTypes } from './tokens';
import { Account } from '../models/account';
import { User } from '../models/user';

const jwtOptions: StrategyOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: (req) => {
    console.log(req.headers.authorization);
    if (req && req.query.token) {
      return req.query.token;
    } else if (req && req.cookies.access_token) {
      return req.cookies.access_token;
    } else if (req && req.headers.authorization) {
      return req.headers.authorization;
    }
  },
};

const jwtVerify = async (payload: { type: string; sub: string }, done: (error: any, user?: any | false) => void) => {
  try {
    if (payload.type !== tokenTypes.ACCESS) {
      throw new Error('Invalid token type');
    }
    const account: any = await Account.findById(payload.sub);
    if (!account) {
      return done(null, false);
    }
    const user: any = await User.findOne({ account_id: account.id });
    const data = {
      ...account._doc,
      ...user._doc,
    };
    done(null, data);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

export { jwtStrategy };
