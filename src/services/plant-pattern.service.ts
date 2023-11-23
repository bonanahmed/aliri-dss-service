import httpStatus from 'http-status';
import { PlantPattern } from '../models/plant-pattern'; // Import the IPlantPatternDocument type from your models
import ApiError from '../utils/ApiError';
import { IPlantPatternDocument } from '../models/plant-pattern/mongoose';
import { Line } from '../models/line';
import { Area } from '../models/area';
import { PlantPatternTemplate } from '../models/plant-pattern-template';
import { Node } from '../models/node';
import mongoose from 'mongoose';

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<IPlantPatternDocument>}
 */
const savePlantPattern = async (body: any, date: string): Promise<any> => {
  const areas = body;
  await PlantPattern.deleteMany({
    date: { $regex: `^${date}` },
  });
  let bodyPlantPatternNew: any = [];
  areas.forEach(async (area: any) => {
    area.plant_patterns.forEach(async (date_plant: any[]) => {
      bodyPlantPatternNew.push({
        ...date_plant,
        line_id: area.line_id,
        area_id: area.id,
        id: undefined,
      });
      // const newDocument = new PlantPattern({
      //   ...date_plant,
      //   line_id: area.line_id,
      //   area_id: area.id,
      // });
      // await newDocument.save();
    });
  });
  return await PlantPattern.insertMany(bodyPlantPatternNew);
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
  // if (filter.line_id) {
  //   filter.id = filter.line_id;
  //   delete filter.line_id;
  // }
  let nodes: any = await Node.paginate(filter, options);
  nodes.docs = await Promise.all(
    nodes.docs.map(async (node: any) => {
      const lines: any = await Line.find({
        node_id: node.id,
      });
      if (!lines) return null;
      const foundData = await Promise.all(
        lines.map(async (line: any) => {
          const area: any = await Area.findOne({
            line_id: line.id,
            type: 'petak tersier',
          }).populate('detail.group');
          if (!area) return null;
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

      return foundData;
    })
  );
  nodes.docs = nodes.docs.flatMap((item: any) => item);
  nodes.docs = nodes.docs.filter((node: any) => {
    return node !== null && node !== undefined;
  });
  return nodes;
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
