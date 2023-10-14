import Joi from 'joi';
import { password } from './custom.validation';

const register = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    email: Joi.string().email(),
    password: Joi.string().required().custom(password),
    full_name: Joi.string().required(),
    role: Joi.string().required(),
  }),
};

const login = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

export { register, login, logout, refreshTokens, forgotPassword, resetPassword, verifyEmail };
