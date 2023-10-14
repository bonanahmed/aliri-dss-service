import httpStatus from 'http-status';
import { PlantPattern } from '../models/plant-pattern'; // Import the IPlantPatternDocument type from your models
import ApiError from '../utils/ApiError';
import { IPlantPatternDocument } from '../models/plant-pattern/mongoose';
import { Line } from '../models/line';
import { Area } from '../models/area';
import { PlantPatternTemplate } from '../models/plant-pattern-template';

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<IPlantPatternDocument>}
 */
const savePlantPattern = async (body: any, date: string): Promise<any> => {
  console.log(body);

  const areas = body;
  await PlantPattern.deleteMany({
    date: { $regex: `^${date}` },
  });
  areas.forEach(async (area: any) => {
    area.plant_patterns.forEach(async (date_plant: any[]) => {
      const newDocument = new PlantPattern({
        ...date_plant,
        line_id: area.line_id,
        area_id: area.id,
      });
      await newDocument.save();
    });
  });
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
const getPlantPatterns = async (filter: any, options: any, date: any): Promise<any> => {
  let lines: any = await Line.paginate(filter, options);
  lines.docs = await Promise.all(
    lines.docs.map(async (line: any) => {
      const area: any = await Area.findOne({
        line_id: line.id,
      }).populate('detail.group');
      const plant_patterns = await PlantPattern.find({
        area_id: area?.id,
        date: { $regex: `^${date}` },
      });
      const plant_pattern_plannings = await PlantPatternTemplate.find({
        plant_pattern_template_name_id: area?.detail?.group.plant_pattern_template_name_id?._id,
        date: { $regex: `^${date}` },
      });
      return {
        ...area?._doc,
        id: area?._id,
        _id: undefined,
        __v: undefined,
        plant_patterns: plant_patterns ?? [],
        plant_pattern_plannings,
      };
    })
  );
  return lines;
};

/**
 * Get user by id
 * @param {string} id
 * @returns {Promise<IPlantPatternDocument | null>}
 */
const getPlantPatternById = async (id: string): Promise<IPlantPatternDocument | null> => {
  return PlantPattern.findById(id);
};

/**
 * Delete user by id
 * @param {string} userId
 * @returns {Promise<IPlantPatternDocument | null>}
 */
const deletePlantPatternById = async (plantPatternId: string): Promise<IPlantPatternDocument | null> => {
  const plantPattern = await getPlantPatternById(plantPatternId);
  if (!plantPattern) {
    throw new ApiError(httpStatus.NOT_FOUND, 'PlantPattern not found');
  }
  await PlantPattern.findByIdAndRemove(plantPatternId);
  return plantPattern;
};

export { savePlantPattern, getPlantPatterns, getPlantPatternById, deletePlantPatternById };
