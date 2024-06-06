import httpStatus from 'http-status';
import { PlantPattern } from '../models/plant-pattern'; // Import the IPlantPatternDocument type from your models
import ApiError from '../utils/ApiError';
import { IPlantPatternDocument } from '../models/plant-pattern/mongoose';
import { Line } from '../models/line';
import { Area } from '../models/area';
import { PlantPatternTemplate } from '../models/plant-pattern-template';
import { Node } from '../models/node';

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<IPlantPatternDocument>}
 */
const savePlantPattern = async (body: any, date: string): Promise<any> => {
  const areas = body;
  let bodyPlantPatternNew: any = [];
  for (const area of areas) {
    await PlantPattern.deleteMany({
      date: { $regex: `^${date}` },
      area_id: area._id,
    });
    for (const date_plant of area.plant_patterns) {
      bodyPlantPatternNew.push({
        ...date_plant,
        line_id: area.line_id,
        area_id: area._id,
        id: undefined,
      });
    }
  }
  // areas.forEach(async (area: any) => {
  //   await PlantPattern.deleteMany({
  //     date: { $regex: `^${date}` },
  //     area_id: area.id,
  //   });
  //   area.plant_patterns.forEach(async (date_plant: any[]) => {
  //     bodyPlantPatternNew.push({
  //       ...date_plant,
  //       line_id: area.line_id,
  //       area_id: area._id,
  //       id: undefined,
  //     });
  //   });
  // });
  return await PlantPattern.insertMany(await Promise.all(bodyPlantPatternNew));
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
// const getPlantPatterns = async (filter: any, options: any, date: any): Promise<any> => {
//   const areaQuery: any = {};
//   if (filter.group_id) {
//     areaQuery.group_id = filter.group_id;
//     delete filter.group_id;
//   }
//   let nodes: any = await Node.paginate(filter, options);
//   nodes.docs = await Promise.all(
//     nodes.docs.map(async (node: any) => {
//       const lines: any = await Line.find({
//         node_id: node.id,
//       });
//       if (!lines) return null;
//       const foundData = await Promise.all(
//         lines.map(async (line: any) => {
//           const queryForThisArea: any = { line_id: line.id, type: 'petak tersier' };
//           if (areaQuery.group_id) {
//             queryForThisArea['detail.group'] = areaQuery.group_id;
//           }
//           const area: any = await Area.findOne(queryForThisArea).populate('detail.group');
//           if (!area) return null;
//           const plant_patterns = await PlantPattern.find({
//             area_id: area?.id,
//             date: { $regex: `^${date}` },
//           });
//           const plant_pattern_plannings = await PlantPatternTemplate.find({
//             plant_pattern_template_name_id: area?.detail?.group.plant_pattern_template_name_id?._id,
//             date: { $regex: `^${date}` },
//           });
//           return {
//             ...area?._doc,
//             id: area?._id,
//             _id: undefined,
//             __v: undefined,
//             plant_patterns: plant_patterns ?? [],
//             plant_pattern_plannings,
//           };
//         })
//       );

//       return foundData;
//     })
//   );
//   nodes.docs = nodes.docs.flatMap((item: any) => item);
//   nodes.docs = nodes.docs.filter((node: any) => {
//     return node !== null && node !== undefined;
//   });
//   console.log(nodes);
//   return nodes;
// };
const getPlantPatterns = async (filter: any, options: any, date: any): Promise<any> => {
  // const query: any = {};
  filter.type = 'petak tersier';
  if (filter.group_id) {
    filter = {
      ...filter,
      'detail.group': filter.group_id,
    };
    delete filter.group_id;
  }
  options.populate = [
    {
      path: 'detail.group',
    },
  ];
  if (filter.line_id) {
    options.populate.push([
      {
        path: 'line_id',

        populate: {
          path: 'node_id',
          populate: {
            path: 'line_id',
            match: {
              _id: filter.line_id,
            },
          },
        },
      },
    ]);
    delete filter.line_id;
  }

  // let areas1: any = await Area.paginate(filter, options);

  let areas: any = await Area.find(filter, {}).populate(options.populate);
  areas = areas.filter((area: any) => area.line_id?.node_id?.line_id !== null);

  let docs = paginate(areas, parseInt(options.page), parseInt(options.limit));
  docs = await Promise.all(
    docs.map(async (doc: any) => {
      const plant_patterns = await PlantPattern.find({
        area_id: doc?.id,
        date: { $regex: `^${date}` },
      });
      const plant_pattern_plannings = await PlantPatternTemplate.find({
        plant_pattern_template_name_id: doc?.detail?.group?.plant_pattern_template_name_id?._id,
        date: { $regex: `^${date}` },
      });
      return {
        plant_patterns: plant_patterns ?? [],
        plant_pattern_plannings,
        ...doc._doc,
      };
    })
  );
  const data = {
    docs: docs,
    totalDocs: areas.length,
    limit: parseInt(options.limit),
    totalPages: countTotalPage(areas, options),
    page: parseInt(options.page),
    // pagingCounter: 1,
    // hasPrevPage: false,
    // hasNextPage: true,
    // prevPage: null,
    // nextPage: 2,
  };

  return data;
};
function paginate(array: any, page: number, pageSize: number) {
  --page; // Adjust page number to zero-based index
  const startIndex = page * pageSize;
  const endIndex = startIndex + pageSize;
  return array.slice(startIndex, endIndex);
}

function countTotalPage(areas: any, options: any) {
  const totalPage =
    Math.ceil(areas.length / parseInt(options.limit)) === 0 ? 1 : Math.ceil(areas.length / parseInt(options.limit));
  return totalPage;
}

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
