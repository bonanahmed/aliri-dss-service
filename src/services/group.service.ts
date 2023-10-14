import httpStatus from 'http-status';
import { Group } from '../models/group'; // Import the IGroupDocument type from your models
import ApiError from '../utils/ApiError';
import { IGroupDocument } from '../models/group/mongoose';
import { PlantPatternTemplate } from '../models/plant-pattern-template';

/**
 * Create a user
 * @param {Object} body
 * @returns {Promise<IGroupDocument>}
 */
const createGroup = async (body: any): Promise<IGroupDocument> => {
  return Group.create(body);
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
const getGroups = async (filter: any, options: any): Promise<any> => {
  const groups = options.limit ? await Group.paginate(filter, options) : await Group.find(filter);
  return groups;
};
const getGroupsWithPlantPattern = async (filter: any, options: any): Promise<any> => {
  const groups = await Group.find(filter);
  const dataReturns = await Promise.all(
    groups.map(async (group: any, index) => {
      console.log(group);
      const plantPattern = await PlantPatternTemplate.find({
        plant_pattern_template_name_id: group.plant_pattern_template_name_id?._id,
      });

      return {
        ...group._doc,
        plantPattern,
      };
    })
  );
  return dataReturns;
};

/**
 * Get user by id
 * @param {string} id
 * @returns {Promise<IGroupDocument | null>}
 */
const getGroupById = async (id: string): Promise<IGroupDocument | null> => {
  return Group.findById(id);
};

/**
 * Update user by id
 * @param {string} groupId
 * @param {Object} updateBody
 * @returns {Promise<IGroupDocument | null>}
 */
const updateGroupById = async (groupId: string, updateBody: any): Promise<IGroupDocument | null> => {
  const group = await getGroupById(groupId);
  if (!group) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Group not found');
  }
  Object.assign(group, updateBody);
  await group.save();
  return group;
};

/**
 * Delete user by id
 * @param {string} userId
 * @returns {Promise<IGroupDocument | null>}
 */
const deleteGroupById = async (groupId: string): Promise<IGroupDocument | null> => {
  const group = await getGroupById(groupId);
  if (!group) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Group not found');
  }
  await Group.findByIdAndRemove(groupId);
  return group;
};

export { createGroup, getGroups, getGroupById, updateGroupById, deleteGroupById, getGroupsWithPlantPattern };
