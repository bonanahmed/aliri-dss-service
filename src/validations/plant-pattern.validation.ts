import Joi from 'joi';
import { objectId } from './custom.validation';

const savePlantPattern = {
  body: Joi.object().keys({
    inputField1: Joi.string().required(),
    numberField2: Joi.number().required(),
    booleanField3: Joi.boolean().required(),
    optionField4: Joi.string().required().valid('1', '2'),
  }),
  query: Joi.object().keys({
    date: Joi.string(),
  }),
};

const getPlantPatterns = {
  query: Joi.object().keys({
    type: Joi.string(),
    date: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getPlantPattern = {
  params: Joi.object().keys({
    templateId: Joi.string().custom(objectId),
  }),
};

const updatePlantPattern = {
  params: Joi.object().keys({
    templateId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      inputField1: Joi.string(),
      numberField2: Joi.number(),
      booleanField3: Joi.boolean(),
      optionField4: Joi.string().valid('1', '2'),
    })
    .min(1),
};

const deletePlantPattern = {
  params: Joi.object().keys({
    templateId: Joi.string().custom(objectId),
  }),
};

export { savePlantPattern, getPlantPatterns, getPlantPattern, updatePlantPattern, deletePlantPattern };
