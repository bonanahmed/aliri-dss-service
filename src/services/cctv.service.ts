import Area from '../models/area/mongoose';

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<any>}
 */
export const getCCTV = async (filter: any, options: any): Promise<any> => {
  if (filter.search) {
    filter.$or = [
      { name: { $regex: new RegExp(filter.search, 'i') } },
      { code: { $regex: new RegExp(filter.search, 'i') } },
    ];
    delete filter.search;
  }
  const areas = options.limit ? await Area.paginate(filter, options) : await Area.find(filter);
  return areas;
};
