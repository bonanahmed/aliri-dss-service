import Joi from 'joi';
import { objectId } from './custom.validation';

const createLine = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    code: Joi.string().required(),
    hierarchy_code: Joi.string(),
    type: Joi.string().required().valid('primer', 'sekunder', 'tersier'),
    parent_id: Joi.string(),
    node_id: Joi.string(),
    detail: Joi.object(),
  }),
};

const getLines = {
  query: Joi.object().keys({
    search: Joi.string(),
    parent_id: Joi.string(),
    type: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getLine = {
  params: Joi.object().keys({
    lineId: Joi.string().custom(objectId),
  }),
};

const updateLine = {
  params: Joi.object().keys({
    lineId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      code: Joi.string(),
      hierarchy_code: Joi.string(),
      type: Joi.string(),
      parent_id: Joi.string(),
      node_id: Joi.string(),
      detail: Joi.object(),
    })
    .min(1),
};

const deleteLine = {
  params: Joi.object().keys({
    lineId: Joi.string().custom(objectId),
  }),
};

export { createLine, getLines, getLine, updateLine, deleteLine };
