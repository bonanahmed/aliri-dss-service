import Joi from "joi";
import { password, objectId } from "./custom.validation";

const createUser = {
  body: Joi.object().keys({
    full_name: Joi.string().required(),
    account_id: Joi.string().required(),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    full_name: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      full_name: Joi.string(),
      account_id: Joi.string(),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

export { createUser, getUsers, getUser, updateUser, deleteUser };
