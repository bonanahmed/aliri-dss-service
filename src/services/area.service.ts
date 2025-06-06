import httpStatus from 'http-status';
import { Area } from '../models/area'; // Import the IAreaDocument type from your models
import ApiError from '../utils/ApiError';
import { IAreaDocument } from '../models/area/mongoose';
import AreaSensor from '../models/area-sensor/mongoose';
import { getRealtimeValues } from './scada.service';
import { AreaDocument } from '../models/area-document';
import { IAreaDocumentDataDocument } from '../models/area-document/mongoose';
import AreaConfiguration, { IAreaConfigurationDocument } from '../models/area-configuration/mongoose';
import Line from '../models/line/mongoose';
import { calculateFlow } from './node.service';
import { NodeToLineDataActual } from '../models/actual-flow';
import { AreaDetail } from '../models/area-detail';

/**
 * Create a user
 * @param {Object} body
 * @returns {Promise<IAreaDocument>}
 */
export const createArea = async (body: any): Promise<any> => {
  const area = await Area.create(body);
  if (area) {
    if (body.area_information) {
      const areaDetail = await AreaDetail.create({
        area_id: area.id,
        description: body.area_information,
      });
      return {
        area,
        areaDetail,
      };
    }
    return area;
  }
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
export const getAreas = async (filter: any, options: any): Promise<any> => {
  if (filter.search) {
    filter.$or = [
      { name: { $regex: new RegExp(filter.search, 'i') } },
      { code: { $regex: new RegExp(filter.search, 'i') } },
    ];
    delete filter.search;
  }
  options.populate = [
    { path: 'parent_id', options: { strictPopulate: false } },
    { path: 'detail.juru', options: { strictPopulate: false } },
    { path: 'detail.group', options: { strictPopulate: false } },
    {
      path: 'line_id',
      options: { strictPopulate: false },
      populate: { path: 'node_id', options: { strictPopulate: false } },
    },
  ];
  const areas = options.limit ? await Area.paginate(filter, options) : await Area.find(filter);
  return areas;
};

/**
 * Get user by id
 * @param {string} id
 * @returns {Promise<IAreaDocument | null>}
 */
export const getAreaById = async (id: string): Promise<any | null> => {
  const area: any = await Area.findById(id);
  if (area) {
    const areaDetail = await AreaDetail.findOne({
      area_id: area.id,
    });
    if (areaDetail) {
      return {
        ...area._doc,
        information: areaDetail,
      };
    }
  }
  return area;
};

/**
 * Get user by id
 * @param {string} id
 * @returns {Promise<IAreaDocument | null>}
 */
export const getAreaPublicDetailById = async (id: string): Promise<any | null> => {
  const area = await Area.findById(id);
  const area_detail = await AreaDetail.findOne({
    area_id: id,
  });
  return {
    id: id,
    name: area?.name,
    description: area_detail?.description,
    image: area?.images[0]?.content,
  };
};

/**
 * Update user by id
 * @param {string} areaId
 * @param {Object} updateBody
 * @returns {Promise<IAreaDocument | null>}
 */
export const updateAreaById = async (areaId: string, updateBody: any): Promise<any | null> => {
  const area = await getAreaById(areaId);
  if (!area) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Area not found');
  }
  // Object.assign(area, updateBody);
  // await area.save();
  const areaUpdate: any = await Area.findByIdAndUpdate(areaId, updateBody);
  if (updateBody.area_information) {
    const areaDetail = await AreaDetail.findOneAndUpdate(
      {
        area_id: areaId,
      },
      {
        description: updateBody.area_information,
      },
      { upsert: true, new: true, runValidators: true }
    );
    return { ...areaUpdate._doc, areaDetail };
  }
  return areaUpdate;
};

/**
 * Delete user by id
 * @param {string} areaId
 * @returns {Promise<IAreaDocument | null>}
 */
export const deleteAreaById = async (areaId: string): Promise<IAreaDocument | null> => {
  const area = await getAreaById(areaId);
  if (!area) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Area not found');
  }
  await Area.findByIdAndRemove(areaId);
  return area;
};

// /**
//  * Query for users
//  * @param {Object} filter - Mongo filter
//  * @param {Object} options - Query options
//  * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
//  * @param {number} [options.limit] - Maximum number of results per page (default = 10)
//  * @param {number} [options.page] - Current page (default = 1)
//  * @returns {Promise<any>}
//  */
// export const getMaps = async (filter: any, options: any): Promise<any> => {
//   if (filter.search) {
//     filter.$or = [{ name: { $regex: new RegExp(filter.search, 'i') } }];
//     delete filter.search;
//   }
//   filter = {
//     ...filter,
//     link_google_map: { $exists: true },
//   };
//   const maps = options.limit
//     ? await Area.paginate(filter, options)
//     : filter.node_id
//     ? await Area.findById(filter.node_id)
//     : await Area.find(filter).select({ link_google_map: 1, name: 1 });
//   return maps;
// };

/**
 * Get Area Sensor by areaId
 * @param {any} data
 * @returns {Promise<any>}
 */
export const upsertDataAreaSensor = async (data: any): Promise<any> => {
  const sensor = await AreaSensor.findOneAndUpdate(
    // { area_id: data.area_id, sensor_type: data.sensor_type },
    { area_id: data.area_id, sensor_code: data.sensor_code },
    {
      ...data,
    },
    { upsert: true, new: true, runValidators: true }
  );
  return sensor;
};

/**
 * Get Area Sensor by areaId
 * @param {string} areaId
 * @returns {Promise<any>}
 */
export const getAreaSensor = async (areaId: string, filter: any): Promise<any> => {
  const areaSensor = await AreaSensor.findOne({ area_id: areaId, ...filter });
  if (!areaSensor) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Area Sensor not found');
  }
  // if (areaSensor?.sensor_code) {
  //   const sensorData = (await getRealtimeValues([areaSensor?.sensor_code]))[0].Value;
  //   await AreaSensor.findByIdAndUpdate(areaSensor.id, {
  //     sensor_value: sensorData,
  //   });
  // }
  const sensor = await AreaSensor.findById(areaSensor?.id);
  return sensor;
};

/**
 * Get Area Sensor List by areaId
 * @param {string} areaId
 * @returns {Promise<any>}
 */
export const getAreaSensors = async (areaId: string, filter: any): Promise<any> => {
  const areaSensor = await AreaSensor.find({ area_id: areaId, ...filter });
  return areaSensor;
};

/**
 * Get Area Sensor List by areaId
 * @param {string} areaId
 * @returns {Promise<any>}
 */
export const getAreaSensorsPapanEksploitasi = async (areaId: string, filter: any): Promise<any> => {
  const areaSensors = await AreaSensor.find({ area_id: areaId, ...filter });
  let areaSensorValue = 0;
  const updateDataSensors = areaSensors.map((areaSensor) => {
    areaSensorValue += parseFloat(areaSensor.sensor_value ?? '0') || 0;
    return areaSensor.sensor_code;
  });
  // const sensorDatas = await getRealtimeValues(updateDataSensors ?? []);
  // // Use Promise.all to update sensor values in parallel
  // await Promise.all(
  //   sensorDatas.map(async (sensorData: any) => {
  //     // Update sensor value in the database
  //     await AreaSensor.findOneAndUpdate(
  //       {
  //         area_id: areaId,
  //         sensor_code: sensorData.Formula,
  //       },
  //       {
  //         sensor_value: sensorData.Value,
  //       }
  //     );

  //     // Safely parse and add sensor value to total
  //     areaSensorValue += parseFloat(sensorData.Value) || 0;
  //   })
  // );
  return areaSensorValue;
};

/**
 * Get Area Sensor Detail by sensorId
 * @param {string} sensorId
 * @returns {Promise<any>}
 */
export const getAreaSensorDetail = async (sensorId: string): Promise<any> => {
  const sensor = await AreaSensor.findById(sensorId);
  return sensor;
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
export const getDocuments = async (filter: any, options: any): Promise<any> => {
  if (filter.search) {
    filter.$or = [{ document_name: { $regex: new RegExp(filter.search, 'i') } }];
    delete filter.search;
  }
  options.populate = [{ path: 'area_id', options: { strictPopulate: false } }];
  const documents = options.limit ? await AreaDocument.paginate(filter, options) : await AreaDocument.find(filter);
  return documents;
};

/**
 * Create a user
 * @param {Object} body
 * @returns {Promise<IAreaDocumentDataDocument>}
 */
export const createDocument = async (body: any): Promise<IAreaDocumentDataDocument> => {
  return await AreaDocument.create(body);
};

/**
 * Delete user by id
 * @param {string} documentId
 * @returns {Promise<IAreaDocumentDataDocument | null>}
 */
export const deleteDocumentById = async (documentId: string): Promise<IAreaDocumentDataDocument | null> => {
  return await AreaDocument.findByIdAndRemove(documentId);
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
export const getConfigurations = async (filter: any, options: any): Promise<any> => {
  if (filter.search) {
    filter.$or = [{ document_name: { $regex: new RegExp(filter.search, 'i') } }];
    delete filter.search;
  }
  options.populate = [{ path: 'area_id', options: { strictPopulate: false } }];
  const documents = options.limit ? await AreaConfiguration.paginate(filter, options) : await AreaConfiguration.find(filter);
  return documents;
};

/**
 * Create a user
 * @param {Object} body
 * @returns {Promise<IAreaConfigurationDocument>}
 */
export const createConfiguration = async (body: any): Promise<IAreaConfigurationDocument> => {
  return await AreaConfiguration.create(body);
};

/**
 * Delete user by id
 * @param {string} documentId
 * @returns {Promise<IAreaConfigurationDocument | null>}
 */
export const deleteConfigurationById = async (documentId: string): Promise<IAreaConfigurationDocument | null> => {
  return await AreaConfiguration.findByIdAndRemove(documentId);
};

/**
 * Get user by id
 * @param {string} id
 * @returns {Promise<IAreaConfigurationDocument | null>}
 */
export const getConfigurationDetailById = async (id: string): Promise<IAreaConfigurationDocument | null> => {
  return await AreaConfiguration.findById(id);
};

/**
 * Get user by id
 * @param {string} areaId
 * @returns {Promise<IAreaConfigurationDocument | null>}
 */
export const getConfigurationDetailByAreaId = async (areaId: string): Promise<IAreaConfigurationDocument | null> => {
  return await AreaConfiguration.findOne({
    area_id: areaId,
  });
};

/**
 * Update user by id
 * @param {string} configId
 * @param {Object} updateBody
 * @returns {Promise<IAreaConfigurationDocument | null>}
 */
export const updateConfigurationById = async (
  configId: string,
  updateBody: any
): Promise<IAreaConfigurationDocument | null> => {
  const area = await getConfigurationDetailById(configId);
  if (!area) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Area Configuration not found');
  }
  Object.assign(area, updateBody);
  await area.save();
  return area;
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
export const getFlowSummaries = async (filter: any, options: any): Promise<any> => {
  filter.$or = [];
  if (filter.search) {
    filter.$or = [{ name: { $regex: new RegExp(filter.search, 'i') } }];
    delete filter.search;
  }
  filter.$or.push({
    type: 'primer',
  });
  filter.$or.push({
    type: 'sekunder',
  });
  options.populate = [{ path: 'area_id', options: { strictPopulate: false } }];
  options.select = '_id id name node_id';
  const summaries: any = options.limit ? await Line.paginate(filter, options) : await Line.find(filter);
  summaries.docs = await Promise.all(
    summaries.docs.map(async (item: any, index: number) => {
      let dataFlow: any;
      dataFlow = await calculateFlow(item.node_id, '');
      let debit_rekomendasi;
      Object.entries(dataFlow.direction).forEach((flowData: any) => {
        if (item._id.toString() === flowData[1].line_id.toString()) {
          debit_rekomendasi = flowData[1].debit_kebutuhan;
        }
      });
      const debit_aktual = await NodeToLineDataActual.findOne({ direction_line: item._id, node_id: item.node_id });
      return {
        ...item._doc,
        debit_rekomendasi: debit_rekomendasi,
        debit_aktual: debit_aktual?.actual_flow_value,
        selisih_debit: (debit_rekomendasi ?? 0) - (debit_aktual?.actual_flow_value ?? 0),
      };
    })
  );
  return summaries;
};
