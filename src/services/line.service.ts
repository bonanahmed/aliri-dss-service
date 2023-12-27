import httpStatus from 'http-status';
import { Line } from '../models/line'; // Import the ILineDocument type from your models
import ApiError from '../utils/ApiError';
import { ILineDocument } from '../models/line/mongoose';

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<ILineDocument>}
 */
const createLine = async (body: any): Promise<ILineDocument> => {
  return await Line.create(body);
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
const getLines = async (filter: any, options: any): Promise<any> => {
  if (filter.search) {
    filter.$or = [{ code: { $regex: new RegExp(filter.search, 'i') } }];
    delete filter.search;
  }
  if (filter.type == '{"$ne":"tersier"}') {
    filter.type = JSON.parse(filter.type);
  }

  options.populate = [
    {
      path: 'node_id',
      options: { strictPopulate: false },
      populate: { path: 'line_id', options: { strictPopulate: false } },
    },
  ];

  const lines = options.limit ? await Line.paginate(filter, options) : await Line.find(filter);
  return lines;
};

/**
 * Get user by id
 * @param {string} id
 * @returns {Promise<ILineDocument | null>}
 */
const getLineById = async (id: string): Promise<ILineDocument | null> => {
  return Line.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<ILineDocument | null>}
 */
const getLineByEmail = async (email: string): Promise<ILineDocument | null> => {
  return Line.findOne({ email });
};

/**
 * Update user by id
 * @param {string} lineId
 * @param {Object} updateBody
 * @returns {Promise<ILineDocument | null>}
 */
const updateLineById = async (lineId: string, updateBody: any): Promise<ILineDocument | null> => {
  const line = await getLineById(lineId);
  if (!line) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Line not found');
  }
  Object.assign(line, updateBody);
  await line.save();
  return line;
};

/**
 * Delete user by id
 * @param {string} userId
 * @returns {Promise<ILineDocument | null>}
 */
const deleteLineById = async (lineId: string): Promise<ILineDocument | null> => {
  const line = await getLineById(lineId);
  if (!line) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Line not found');
  }
  await Line.findByIdAndRemove(lineId);
  return line;
};

export { createLine, getLines, getLineById, getLineByEmail, updateLineById, deleteLineById };
