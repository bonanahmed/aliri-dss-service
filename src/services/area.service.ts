import httpStatus from 'http-status';
import { Area } from '../models/area'; // Import the IAreaDocument type from your models
import ApiError from '../utils/ApiError';
import { IAreaDocument } from '../models/area/mongoose';
import AreaSensor from '../models/area-sensor/mongoose';
import { getRealtimeValues } from './scada.service';

/**
 * Create a user
 * @param {Object} body
 * @returns {Promise<IAreaDocument>}
 */
export const createArea = async (body: any): Promise<IAreaDocument> => {
  return await Area.create(body);
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
export const getAreaById = async (id: string): Promise<IAreaDocument | null> => {
  return await Area.findById(id);
};

/**
 * Update user by id
 * @param {string} areaId
 * @param {Object} updateBody
 * @returns {Promise<IAreaDocument | null>}
 */
export const updateAreaById = async (areaId: string, updateBody: any): Promise<IAreaDocument | null> => {
  const area = await getAreaById(areaId);
  if (!area) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Area not found');
  }
  Object.assign(area, updateBody);
  await area.save();
  return area;
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

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<any>}
 */
export const getMaps = async (filter: any, options: any): Promise<any> => {
  if (filter.search) {
    filter.$or = [{ name: { $regex: new RegExp(filter.search, 'i') } }];
    delete filter.search;
  }
  filter = {
    ...filter,
    link_google_map: { $exists: true },
  };
  const maps = options.limit
    ? await Area.paginate(filter, options)
    : filter.node_id
    ? await Area.findById(filter.node_id)
    : await Area.find(filter).select({ link_google_map: 1, name: 1 });
  return maps;
};

/**
 * Get Area Sensor by areaId
 * @param {any} data
 * @returns {Promise<any>}
 */
export const upsertDataAreaSensor = async (data: any): Promise<any> => {
  const sensor = await AreaSensor.findOneAndUpdate(
    { area_id: data.area_id, sensor_type: data.sensor_type },
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
  if (areaSensor?.sensor_code) {
    const sensorData = (await getRealtimeValues([areaSensor?.sensor_code]))[0].Value;
    await AreaSensor.findByIdAndUpdate(areaSensor.id, {
      sensor_value: sensorData,
    });
  }
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
 * Get Area Sensor Detail by sensorId
 * @param {string} sensorId
 * @returns {Promise<any>}
 */
export const getAreaSensorDetail = async (sensorId: string): Promise<any> => {
  const sensor = await AreaSensor.findById(sensorId);
  return sensor;
};
