import httpStatus from 'http-status';
import { Configuration } from '../models/configuration'; // Import the IConfigurationDocument type from your models
import ApiError from '../utils/ApiError';
import { IConfigurationDocument } from '../models/configuration/mongoose';

/**
 * Create a user
 * @param {Object} body
 * @returns {Promise<IConfigurationDocument>}
 */
const createConfiguration = async (body: any): Promise<IConfigurationDocument> => {
  return Configuration.create(body);
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
const getConfigurations = async (filter: any, options: any): Promise<any> => {
  if (filter.search) {
    filter.$or = [{ code: { $regex: new RegExp(filter.search, 'i') } }];
    delete filter.search;
  }
  const configurations = options.limit ? await Configuration.paginate(filter, options) : await Configuration.find(filter);
  return configurations;
};

/**
 * Get user by id
 * @param {string} id
 * @returns {Promise<IConfigurationDocument | null>}
 */
const getConfigurationById = async (id: string): Promise<IConfigurationDocument | null> => {
  return Configuration.findById(id);
};

/**
 * Update user by id
 * @param {string} configurationId
 * @param {Object} updateBody
 * @returns {Promise<IConfigurationDocument | null>}
 */
const updateConfigurationById = async (configurationId: string, updateBody: any): Promise<IConfigurationDocument | null> => {
  const configuration = await getConfigurationById(configurationId);
  if (!configuration) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Configuration not found');
  }
  Object.assign(configuration, updateBody);
  await configuration.save();
  return configuration;
};

/**
 * Delete user by id
 * @param {string} userId
 * @returns {Promise<IConfigurationDocument | null>}
 */
const deleteConfigurationById = async (configurationId: string): Promise<IConfigurationDocument | null> => {
  const configuration = await getConfigurationById(configurationId);
  if (!configuration) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Configuration not found');
  }
  await Configuration.findByIdAndRemove(configurationId);
  return configuration;
};

export { createConfiguration, getConfigurations, getConfigurationById, updateConfigurationById, deleteConfigurationById };
