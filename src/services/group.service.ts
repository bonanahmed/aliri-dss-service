import httpStatus from 'http-status';
import { Group } from '../models/group'; // Import the IGroupDocument type from your models
import ApiError from '../utils/ApiError';
import { IGroupDocument } from '../models/group/mongoose';
import { PlantPatternTemplate } from '../models/plant-pattern-template';
import { Area } from '../models/area';

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
  if (filter.search) {
    filter.$or = [{ name: { $regex: new RegExp(filter.search, 'i') } }];
    delete filter.search;
  }
  options.populate = [{ path: 'area_id', options: { strictPopulate: false } }];
  const groups = options.limit ? await Group.paginate(filter, options) : await Group.find(filter);
  return groups;
};
const getGroupsWithPlantPattern = async (filter: any, options: any): Promise<any> => {
  if (filter.search) {
    filter.$or = [{ name: { $regex: new RegExp(filter.search, 'i') } }];
    delete filter.search;
  }
  if (filter.period) {
  }
  const groups = await Group.find(filter);
  const dataReturns = await Promise.all(
    groups.map(async (group: any, index) => {
      const areaDatas = await Area.find({
        'detail.group': group.id,
      });
      let areaTotal = 0;
      areaDatas.forEach((area: any) => {
        areaTotal += area.detail?.standard_area ?? 0;
      });
      let plantPattern: any = await PlantPatternTemplate.find({
        plant_pattern_template_name_id: group.plant_pattern_template_name_id?._id,
      });
      // console.log(plantPattern);
      plantPattern._doc = plantPattern.map((plant: any) => {
        let flow_water_needed = plant.pasten * areaTotal;
        plant._doc = {
          ...plant._doc,
          flow_water_needed,
        };
        return plant;
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
