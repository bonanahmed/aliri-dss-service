import httpStatus from 'http-status';
import { Kemantren } from '../models/kemantren'; // Import the IKemantrenDocument type from your models
import ApiError from '../utils/ApiError';
import { IKemantrenDocument } from '../models/kemantren/mongoose';

/**
 * Create a user
 * @param {Object} body
 * @returns {Promise<IKemantrenDocument>}
 */
const createKemantren = async (body: any): Promise<IKemantrenDocument> => {
  return Kemantren.create(body);
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
const getKemantrens = async (filter: any, options: any): Promise<any> => {
  const kemantrens = options.limit ? await Kemantren.paginate(filter, options) : await Kemantren.find(filter);
  return kemantrens;
};

/**
 * Get user by id
 * @param {string} id
 * @returns {Promise<IKemantrenDocument | null>}
 */
const getKemantrenById = async (id: string): Promise<IKemantrenDocument | null> => {
  return Kemantren.findById(id);
};

/**
 * Update user by id
 * @param {string} kemantrenId
 * @param {Object} updateBody
 * @returns {Promise<IKemantrenDocument | null>}
 */
const updateKemantrenById = async (kemantrenId: string, updateBody: any): Promise<IKemantrenDocument | null> => {
  const kemantren = await getKemantrenById(kemantrenId);
  if (!kemantren) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Kemantren not found');
  }
  Object.assign(kemantren, updateBody);
  await kemantren.save();
  return kemantren;
};

/**
 * Delete user by id
 * @param {string} userId
 * @returns {Promise<IKemantrenDocument | null>}
 */
const deleteKemantrenById = async (kemantrenId: string): Promise<IKemantrenDocument | null> => {
  const kemantren = await getKemantrenById(kemantrenId);
  if (!kemantren) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Kemantren not found');
  }
  await Kemantren.findByIdAndRemove(kemantrenId);
  return kemantren;
};

export { createKemantren, getKemantrens, getKemantrenById, updateKemantrenById, deleteKemantrenById };
