import httpStatus from 'http-status';
import { PlantPatternTemplate } from '../models/plant-pattern-template'; // Import the IPlantPatternTemplateDocument type from your models
import ApiError from '../utils/ApiError';
import { IPlantPatternTemplateDocument } from '../models/plant-pattern-template/mongoose';
import { PlantPatternTemplateName } from '../models/plant-pattern-template-name';

/**
 * Create a user
 * @param {Object} body
 * @returns {Promise<any>}
 */
const createPlantPatternTemplate = async (body: any): Promise<any> => {
  const plantPatternName = await PlantPatternTemplateName.create(body);
  const plant_patterns = body.plant_patterns.map((item: any) => {
    return {
      plant_pattern_template_name_id: plantPatternName.id,
      ...item,
      id: undefined,
    };
  });
  const plantPattern = await PlantPatternTemplate.insertMany(plant_patterns);
  return {
    plantPatternName,
    plantPattern,
  };
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
const getPlantPatternTemplates = async (filter: any, options: any): Promise<any> => {
  if (filter.search) {
    filter.$or = [{ name: { $regex: new RegExp(filter.search, 'i') } }];
    delete filter.search;
  }
  const plantPatternTemplateNames: any = options.limit
    ? await PlantPatternTemplateName.paginate(filter, options)
    : await PlantPatternTemplateName.find(filter);
  const plantName = options.limit ? plantPatternTemplateNames.docs : plantPatternTemplateNames;
  const docs = await Promise.all(
    plantName.map(async (item: any) => {
      const plantPatternTemplates = await PlantPatternTemplate.find({
        plant_pattern_template_name_id: item.id,
      });
      return { ...item._doc, plant_patterns: plantPatternTemplates };
    })
  );
  const data = options.limit
    ? {
        ...plantPatternTemplateNames,
        docs: docs,
      }
    : docs;

  return data;
};

/**
 * Get user by id
 * @param {string} id
 * @returns {Promise<any | null>}
 */
const getPlantPatternTemplateById = async (id: string): Promise<any | null> => {
  const plantPatternTemplateNames = await PlantPatternTemplateName.findById(id);
  const plantPatternTemplates = await PlantPatternTemplate.find({
    plant_pattern_template_name_id: plantPatternTemplateNames?.id,
  });
  return { plantPatternTemplateNames, plantPatternTemplates };
};

/**
 * Update user by id
 * @param {string} plantPatternTemplateId
 * @param {Object} body
 * @returns {Promise<IPlantPatternTemplateDocument | null>}
 */
const updatePlantPatternTemplateById = async (plantPatternTemplateId: string, body: any): Promise<any> => {
  const plantPatternTemplate = await getPlantPatternTemplateById(plantPatternTemplateId);
  if (!plantPatternTemplate) {
    throw new ApiError(httpStatus.NOT_FOUND, 'PlantPatternTemplate not found');
  }
  // Object.assign(plantPatternTemplate, updateBody);
  // await plantPatternTemplate.save();
  await PlantPatternTemplateName.findByIdAndUpdate(plantPatternTemplateId, body);
  await PlantPatternTemplate.deleteMany({
    plant_pattern_template_name_id: plantPatternTemplateId,
  });

  const plant_patterns = body.plant_patterns.map((item: any) => {
    return {
      plant_pattern_template_name_id: plantPatternTemplateId,
      code: item.code,
      color: item.color,
      date: item.date,
      growth_time: item.growth_time,
      pasten: item.pasten,
      plant_type: item.plant_type,
      created_at: item.created_at,
      updated_at: item.updated_at,
      id: undefined,
    };
  });
  const plantPattern = await PlantPatternTemplate.insertMany(plant_patterns);
  return {
    plantPatternTemplate,
    plantPattern,
  };
};

/**
 * Delete user by id
 * @param {string} userId
 * @returns {Promise<IPlantPatternTemplateDocument | null>}
 */
const deletePlantPatternTemplateById = async (
  plantPatternTemplateId: string
): Promise<IPlantPatternTemplateDocument | null> => {
  const plantPatternTemplate = await getPlantPatternTemplateById(plantPatternTemplateId);
  if (!plantPatternTemplate) {
    throw new ApiError(httpStatus.NOT_FOUND, 'PlantPatternTemplate not found');
  }
  await PlantPatternTemplateName.findByIdAndRemove(plantPatternTemplateId);
  await PlantPatternTemplate.deleteMany({ plant_pattern_template_name_id: plantPatternTemplateId });
  return plantPatternTemplate;
};

export {
  createPlantPatternTemplate,
  getPlantPatternTemplates,
  getPlantPatternTemplateById,
  updatePlantPatternTemplateById,
  deletePlantPatternTemplateById,
};
