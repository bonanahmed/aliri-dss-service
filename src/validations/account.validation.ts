import Joi from 'joi';
import { password, objectId } from './custom.validation';

const createUserAndAccount = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    profile_pic: Joi.string(),
    role: Joi.string().required(),
    mobile_phone_number: Joi.string(),
    status: Joi.boolean().required(),
  }),
};

const getUsersAndAccounts = {
  query: Joi.object().keys({
    search: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUserByAccountId = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const updateUserAndAccount = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      username: Joi.string().required(),
      email: Joi.string().required().email(),
      profile_pic: Joi.string(),
      name: Joi.string().required(),
      role: Joi.string().required(),
      mobile_phone_number: Joi.string().required(),
      status: Joi.boolean().required(),
      // user
      KTP: Joi.string().required(),
      gender: Joi.string().required(),
      religion: Joi.string().required(),
      blood_type: Joi.string().required(),
      family_status: Joi.string().required(),
      PTKP: Joi.string().required(),
      NPWP: Joi.string().required(),
      BPJS: Joi.string().required(),
      last_education: Joi.object().required(),
      address: Joi.object(),
      career: Joi.object(),
    })
    .min(1),
};

const deleteUserAndAccount = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

export { createUserAndAccount, getUsersAndAccounts, getUserByAccountId, updateUserAndAccount, deleteUserAndAccount };
