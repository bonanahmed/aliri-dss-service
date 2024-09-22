import httpStatus from 'http-status';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { nodeService } from '../services';
import ApiResponse from '../utils/ApiResponse';
import { addDaysToDate, daysBetweenDates } from '../utils/dateUtils';
import moment from 'moment';

export const createNode = catchAsync(async (req, res) => {
  const node = await nodeService.createNode(req.body);
  ApiResponse(res, httpStatus.CREATED, 'create success', node);
});

export const getNodes = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['search', 'type', 'parent_id', 'area_id']);
  const options = {
    ...pick(req.query, ['sortBy', 'limit', 'page']),
  };
  const result = await nodeService.getNodes(filter, options);
  ApiResponse(res, httpStatus.OK, httpStatus[200], result);
});

export const getNode = catchAsync(async (req, res) => {
  const node = await nodeService.getNodeById(req.params.nodeId);
  if (!node) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Node not found');
  }
  ApiResponse(res, httpStatus.OK, httpStatus[200], node);
});

export const updateNode = catchAsync(async (req, res) => {
  const node = await nodeService.updateNodeById(req.params.nodeId, req.body);
  ApiResponse(res, httpStatus.OK, 'update success', node);
});

export const deleteNode = catchAsync(async (req, res) => {
  const node = await nodeService.deleteNodeById(req.params.nodeId);
  ApiResponse(res, httpStatus.OK, 'delete success', node);
});

export const generatePapanEksploitasi = catchAsync(async (req, res) => {
  const node = await nodeService.generatePapanEksploitasi(req.params.nodeId);
  ApiResponse(res, httpStatus.OK, 'generate success', node);
});
export const getMapNodeData = catchAsync(async (req, res) => {
  const node = await nodeService.getMapNodeData(req.params.code);
  ApiResponse(res, httpStatus.OK, httpStatus[200], node);
});

export const calculateFlow = catchAsync(async (req, res) => {
  const { date } = req.query;
  const node = await nodeService.calculateFlow(req.params.nodeId, date as string);
  ApiResponse(res, httpStatus.OK, 'generate success', node);
});

export const linesInNode = catchAsync(async (req, res) => {
  const node = await nodeService.linesInNode(req.params.nodeId);
  ApiResponse(res, httpStatus.OK, 'find line by node success', node);
});

// SENSOR
export const upsertDataNodeSensor = catchAsync(async (req, res) => {
  const body = req.body;
  const node = await nodeService.upsertDataNodeSensor(body);
  ApiResponse(res, httpStatus.OK, 'Tambah Data Berhasil', node);
});

export const getDataNodeSensors = catchAsync(async (req, res) => {
  const sensors = await nodeService.getDataNodeSensors(req.params.nodeId);
  ApiResponse(res, httpStatus.OK, httpStatus[200], sensors);
});

export const getDataNodeSensor = catchAsync(async (req, res) => {
  const query = req.query;
  const sensor = await nodeService.getDataNodeSensor(req.params.nodeId, req.params.lineId, query);
  ApiResponse(res, httpStatus.OK, httpStatus[200], sensor);
});

export const getDataNodeSensorDetail = catchAsync(async (req, res) => {
  const sensor = await nodeService.getDataNodeSensorDetail(req.params.sensorId);
  ApiResponse(res, httpStatus.OK, httpStatus[200], sensor);
});

export const deleteNodeSensor = catchAsync(async (req, res) => {
  const sensor = await nodeService.deleteNodeSensor(req.params.nodeId);
  ApiResponse(res, httpStatus.OK, 'delete success', sensor);
});

export const updateManyNodes = catchAsync(async (req, res) => {
  const node = await nodeService.updateManyNodes(req.body);
  ApiResponse(res, httpStatus.OK, 'updates success', node);
});

//Actual Flow
export const upsertDataNodeToLineDataActual = catchAsync(async (req, res) => {
  const body = req.body;
  let returnData: any;

  if (body.dataFilter.withDate) {
    const days = daysBetweenDates(body.dataFilter.startDate, body.dataFilter.endDate);
    let promises = [];
    for (let i = 0; i <= days; i++) {
      const newBody = {
        ...body,
        date: addDaysToDate(body.dataFilter.startDate, i),
      };
      delete newBody.dataFilter;
      const data = await nodeService.upsertDataNodeToLineDataActual(newBody);
      promises.push(data);
      returnData = await Promise.all(promises);
    }
  } else {
    const data = await nodeService.upsertDataNodeToLineDataActual({
      ...body,
      date: moment(new Date()).format('YYYY-MM-DD'),
    });
    returnData = data;
  }
  ApiResponse(res, httpStatus.OK, 'Tambah Data Berhasil', returnData);
});

export const getDataNodeToLineDataActuals = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['search', 'type', 'parent_id']);
  const options = {
    ...pick(req.query, ['sortBy', 'limit', 'page']),
  };
  filter.node_id = req.params.nodeId;
  const result = await nodeService.getDataNodeToLineDataActuals(filter, options);
  ApiResponse(res, httpStatus.OK, httpStatus[200], result);
});

export const getDataNodeToLineDataActual = catchAsync(async (req, res) => {
  const query = req.query;
  const data = await nodeService.getDataNodeToLineDataActual(req.params.nodeId, req.params.lineId, query);
  ApiResponse(res, httpStatus.OK, httpStatus[200], data);
});

export const deleteNodeToLineDataActual = catchAsync(async (req, res) => {
  const node = await nodeService.deleteNodeToLineDataActual(req.params.actualFlowId);
  ApiResponse(res, httpStatus.OK, 'delete success', node);
});
// export const convertToHm = catchAsync(async (req, res) => {
//   const node = await nodeService.convertToHm();
//   ApiResponse(res, httpStatus.OK, 'convert success', node);
// });
