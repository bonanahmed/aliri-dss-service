import Joi from 'joi';
import { objectId } from './custom.validation';

const createArea = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    code: Joi.string().required(),
    hierarchy_code: Joi.string(),
    type: Joi.string().required().valid('daerah irigasi', 'petak tersier'),
    // type: Joi.string().required(),
    parent_id: Joi.string(),
    line_id: Joi.string(),
    detail: Joi.object(),
  }),
};

const getAreas = {
  query: Joi.object().keys({
    parent_id: Joi.string(),
    node_id: Joi.string(),
    type: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getArea = {
  params: Joi.object().keys({
    areaId: Joi.string().custom(objectId),
  }),
};

const updateArea = {
  params: Joi.object().keys({
    areaId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      code: Joi.string(),
      hierarchy_code: Joi.string(),
      type: Joi.string().required().valid('daerah irigasi', 'petak tersier'),
      parent_id: Joi.string(),
      line_id: Joi.string(),
      detail: Joi.object(),
    })
    .min(1),
};

const deleteArea = {
  params: Joi.object().keys({
    areaId: Joi.string().custom(objectId),
  }),
};

export { createArea, getAreas, getArea, updateArea, deleteArea };
