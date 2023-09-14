import Joi from "joi";
import { password, objectId } from "./custom.validation";

const createTemplate = {
  body: Joi.object().keys({
    inputField1: Joi.string().required(),
    numberField2: Joi.number().required(),
    booleanField3: Joi.boolean().required(),
    optionField4: Joi.string().required().valid("1", "2"),
  }),
};

const getTemplates = {
  query: Joi.object().keys({
    query1: Joi.string(),
    query2: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getTemplate = {
  params: Joi.object().keys({
    templateId: Joi.string().custom(objectId),
  }),
};

const updateTemplate = {
  params: Joi.object().keys({
    templateId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      inputField1: Joi.string(),
      numberField2: Joi.number(),
      booleanField3: Joi.boolean(),
      optionField4: Joi.string().valid("1", "2"),
    })
    .min(1),
};

const deleteTemplate = {
  params: Joi.object().keys({
    templateId: Joi.string().custom(objectId),
  }),
};

export {
  createTemplate,
  getTemplates,
  getTemplate,
  updateTemplate,
  deleteTemplate,
};
