import Joi from 'joi';
import { objectId } from './custom.validation';

const createNode = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    code: Joi.string().required(),
    hierarchy_code: Joi.string(),
    // type: Joi.string().required().valid('primer', 'sekunder', 'tersier'),
    type: Joi.string().required(),
    parent_id: Joi.string(),
    prev_id: Joi.string(),
    area_id: Joi.string(),
    images: Joi.array(),
    line_id: Joi.string(),
    detail: Joi.object(),
  }),
};

const getNodes = {
  query: Joi.object().keys({
    search: Joi.string(),
    parent_id: Joi.string(),
    node_id: Joi.string(),
    type: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getNode = {
  params: Joi.object().keys({
    nodeId: Joi.string().custom(objectId),
  }),
};

const updateNode = {
  params: Joi.object().keys({
    nodeId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      code: Joi.string(),
      hierarchy_code: Joi.string(),
      // type: Joi.string().valid('primer', 'sekunder', 'tersier'),
      type: Joi.string(),
      parent_id: Joi.string(),
      prev_id: Joi.string(),
      images: Joi.array(),
      line_id: Joi.string(),
      area_id: Joi.string(),
      detail: Joi.object(),
    })
    .min(1),
};

const deleteNode = {
  params: Joi.object().keys({
    nodeId: Joi.string().custom(objectId),
  }),
};

export { createNode, getNodes, getNode, updateNode, deleteNode };
