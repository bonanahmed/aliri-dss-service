import httpStatus from 'http-status';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { areaService } from '../services';
import ApiResponse from '../utils/ApiResponse';

export const createArea = catchAsync(async (req, res) => {
  const area = await areaService.createArea(req.body);
  ApiResponse(res, httpStatus.CREATED, 'create success', area);
});

export const getAreas = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['search', 'type', 'parent_id']);
  const options = {
    ...pick(req.query, ['sortBy', 'limit', 'page']),
  };

  const result = await areaService.getAreas(filter, options);
  ApiResponse(res, httpStatus.OK, httpStatus[200], result);
});

export const getArea = catchAsync(async (req, res) => {
  const area = await areaService.getAreaById(req.params.areaId);
  if (!area) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Area not found');
  }
  ApiResponse(res, httpStatus.OK, httpStatus[200], area);
});

export const updateArea = catchAsync(async (req, res) => {
  const area = await areaService.updateAreaById(req.params.areaId, req.body);
  ApiResponse(res, httpStatus.OK, 'update success', area);
});

export const deleteArea = catchAsync(async (req, res) => {
  const area = await areaService.deleteAreaById(req.params.areaId);
  ApiResponse(res, httpStatus.OK, 'delete success', area);
});

export const getMaps = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['search', 'node_id']);
  const options = {
    ...pick(req.query, ['sortBy', 'limit', 'page']),
  };

  const result = await areaService.getMaps(filter, options);
  ApiResponse(res, httpStatus.OK, httpStatus[200], result);
});

export const upsertDataAreaSensor = catchAsync(async (req, res) => {
  const body = req.body;
  const sensor = await areaService.upsertDataAreaSensor(body);
  ApiResponse(res, httpStatus.OK, httpStatus[200], sensor);
});

export const getAreaSensor = catchAsync(async (req, res) => {
  const query = req.query;
  const sensor = await areaService.getAreaSensor(req.params.areaId, query);
  ApiResponse(res, httpStatus.OK, httpStatus[200], sensor);
});

export const getAreaSensors = catchAsync(async (req, res) => {
  const query = req.query;
  const sensor = await areaService.getAreaSensors(req.params.areaId, query);
  ApiResponse(res, httpStatus.OK, httpStatus[200], sensor);
});

export const getAreaSensorDetail = catchAsync(async (req, res) => {
  const sensor = await areaService.getAreaSensorDetail(req.params.sensorId);
  ApiResponse(res, httpStatus.OK, httpStatus[200], sensor);
});

export const getDocuments = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['search', 'area_id']);
  const options = {
    ...pick(req.query, ['sortBy', 'limit', 'page']),
  };
  const documents = await areaService.getDocuments(filter, options);
  ApiResponse(res, httpStatus.OK, httpStatus[200], documents);
});

export const createDocument = catchAsync(async (req, res) => {
  const body = req.body;
  const sensor = await areaService.createDocument(body);
  ApiResponse(res, httpStatus.OK, httpStatus[200], sensor);
});

export const deleteDocument = catchAsync(async (req, res) => {
  const area = await areaService.deleteDocumentById(req.params.documentId);
  ApiResponse(res, httpStatus.OK, 'delete success', area);
});
export const getConfigurations = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['search', 'area_id']);
  const options = {
    ...pick(req.query, ['sortBy', 'limit', 'page']),
  };
  const documents = await areaService.getConfigurations(filter, options);
  ApiResponse(res, httpStatus.OK, httpStatus[200], documents);
});

export const createConfiguration = catchAsync(async (req, res) => {
  const body = req.body;
  const sensor = await areaService.createConfiguration(body);
  ApiResponse(res, httpStatus.OK, httpStatus[200], sensor);
});

export const deleteConfiguration = catchAsync(async (req, res) => {
  const area = await areaService.deleteConfigurationById(req.params.configId);
  ApiResponse(res, httpStatus.OK, 'delete success', area);
});

export const getConfigurationDetail = catchAsync(async (req, res) => {
  const area = await areaService.getConfigurationDetailById(req.params.configId);
  if (!area) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Area not found');
  }
  ApiResponse(res, httpStatus.OK, httpStatus[200], area);
});

export const updateConfiguration = catchAsync(async (req, res) => {
  const area = await areaService.updateConfigurationById(req.params.configId, req.body);
  ApiResponse(res, httpStatus.OK, 'update success', area);
});

export const getFlowSummaries = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['search', 'area_id']);
  const options = {
    ...pick(req.query, ['sortBy', 'limit', 'page']),
  };
  const summaries = await areaService.getFlowSummaries(filter, options);
  ApiResponse(res, httpStatus.OK, httpStatus[200], summaries);
});
