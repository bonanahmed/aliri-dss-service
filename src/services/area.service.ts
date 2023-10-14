import httpStatus from 'http-status';
import { Area } from '../models/area'; // Import the IAreaDocument type from your models
import ApiError from '../utils/ApiError';
import { IAreaDocument } from '../models/area/mongoose';

/**
 * Create a user
 * @param {Object} body
 * @returns {Promise<IAreaDocument>}
 */
const createArea = async (body: any): Promise<IAreaDocument> => {
  return Area.create(body);
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
const getAreas = async (filter: any, options: any): Promise<any> => {
  const areas = options.limit ? await Area.paginate(filter, options) : await Area.find(filter);
  return areas;
};

/**
 * Get user by id
 * @param {string} id
 * @returns {Promise<IAreaDocument | null>}
 */
const getAreaById = async (id: string): Promise<IAreaDocument | null> => {
  return Area.findById(id);
};

/**
 * Update user by id
 * @param {string} areaId
 * @param {Object} updateBody
 * @returns {Promise<IAreaDocument | null>}
 */
const updateAreaById = async (areaId: string, updateBody: any): Promise<IAreaDocument | null> => {
  const area = await getAreaById(areaId);
  if (!area) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Area not found');
  }
  Object.assign(area, updateBody);
  await area.save();
  return area;
};

/**
 * Delete user by id
 * @param {string} areaId
 * @returns {Promise<IAreaDocument | null>}
 */
const deleteAreaById = async (areaId: string): Promise<IAreaDocument | null> => {
  const area = await getAreaById(areaId);
  if (!area) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Area not found');
  }
  await Area.findByIdAndRemove(areaId);
  return area;
};

export { createArea, getAreas, getAreaById, updateAreaById, deleteAreaById };
