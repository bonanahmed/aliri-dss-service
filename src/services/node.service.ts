import httpStatus from 'http-status';
import { Node } from '../models/node'; // Import the INodeDocument type from your models
import ApiError from '../utils/ApiError';
import { INodeDocument } from '../models/node/mongoose';

/**
 * Create a user
 * @param {Object} body
 * @returns {Promise<INodeDocument>}
 */
const createNode = async (body: any): Promise<INodeDocument> => {
  return await Node.create(body);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<any>}
 */
const getNodes = async (filter: any, options: any): Promise<any> => {
  if (filter.search) {
    filter.$or = [
      { code: { $regex: new RegExp(filter.search, 'i') } },
      { name: { $regex: new RegExp(filter.search, 'i') } },
    ];
    delete filter.search;
  }
  const nodes = options.limit ? await Node.paginate(filter, options) : await Node.find(filter);
  return nodes;
};

/**
 * Get user by id
 * @param {string} id
 * @returns {Promise<INodeDocument | null>}
 */
const getNodeById = async (id: string): Promise<INodeDocument | null> => {
  return Node.findById(id);
};

/**
 * Update user by id
 * @param {string} nodeId
 * @param {Object} updateBody
 * @returns {Promise<INodeDocument | null>}
 */
const updateNodeById = async (nodeId: string, updateBody: any): Promise<INodeDocument | null> => {
  const node = await getNodeById(nodeId);
  if (!node) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Node not found');
  }
  Object.assign(node, updateBody);
  await node.save();
  return node;
};

/**
 * Delete user by id
 * @param {string} nodeId
 * @returns {Promise<INodeDocument | null>}
 */
const deleteNodeById = async (nodeId: string): Promise<INodeDocument | null> => {
  const node = await getNodeById(nodeId);
  if (!node) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Node not found');
  }
  await Node.findByIdAndRemove(nodeId);
  return node;
};

export { createNode, getNodes, getNodeById, updateNodeById, deleteNodeById };
