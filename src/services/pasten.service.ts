import httpStatus from 'http-status';
import { Pasten } from '../models/pasten'; // Import the IPastenDocument type from your models
import ApiError from '../utils/ApiError';
import { IPastenDocument } from '../models/pasten/mongoose';

/**
 * Create a user
 * @param {Object} body
 * @returns {Promise<IPastenDocument>}
 */
const createPasten = async (body: any): Promise<IPastenDocument> => {
  return Pasten.create(body);
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
const getPastens = async (filter: any, options: any): Promise<any> => {
  if (filter.search) {
    filter.$or = [{ code: { $regex: new RegExp(filter.search, 'i') } }];
    delete filter.search;
  }
  const pastens = options.limit ? await Pasten.paginate(filter, options) : await Pasten.find(filter);
  return pastens;
};

/**
 * Get user by id
 * @param {string} id
 * @returns {Promise<IPastenDocument | null>}
 */
const getPastenById = async (id: string): Promise<IPastenDocument | null> => {
  return Pasten.findById(id);
};

/**
 * Update user by id
 * @param {string} pastenId
 * @param {Object} updateBody
 * @returns {Promise<IPastenDocument | null>}
 */
const updatePastenById = async (pastenId: string, updateBody: any): Promise<IPastenDocument | null> => {
  const pasten = await getPastenById(pastenId);
  if (!pasten) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Pasten not found');
  }
  Object.assign(pasten, updateBody);
  await pasten.save();
  return pasten;
};

/**
 * Delete user by id
 * @param {string} userId
 * @returns {Promise<IPastenDocument | null>}
 */
const deletePastenById = async (pastenId: string): Promise<IPastenDocument | null> => {
  const pasten = await getPastenById(pastenId);
  if (!pasten) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Pasten not found');
  }
  await Pasten.findByIdAndRemove(pastenId);
  return pasten;
};

export { createPasten, getPastens, getPastenById, updatePastenById, deletePastenById };
