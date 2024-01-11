import Joi from 'joi';
import { password, objectId } from './custom.validation';

const createKemantren = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    area_id: Joi.string(),
  }),
};

const getKemantrens = {
  query: Joi.object().keys({
    area_id: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getKemantren = {
  params: Joi.object().keys({
    kemantrenId: Joi.string().custom(objectId),
  }),
};

const updateKemantren = {
  params: Joi.object().keys({
    kemantrenId: Joi.required().custom(objectId),
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

const deleteKemantren = {
  params: Joi.object().keys({
    kemantrenId: Joi.string().custom(objectId),
  }),
};

export { createKemantren, getKemantrens, getKemantren, updateKemantren, deleteKemantren };
