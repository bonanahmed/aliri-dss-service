import httpStatus from 'http-status';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { nodeService } from '../services';
import ApiResponse from '../utils/ApiResponse';

export const createNode = catchAsync(async (req, res) => {
  const node = await nodeService.createNode(req.body);
  ApiResponse(res, httpStatus.CREATED, 'create success', node);
});

export const getNodes = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['search', 'type', 'parent_id']);
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
  const node = await nodeService.calculateFlow(req.params.nodeId);
  ApiResponse(res, httpStatus.OK, 'generate success', node);
});
export const convertToHm = catchAsync(async (req, res) => {
  const node = await nodeService.convertToHm();
  ApiResponse(res, httpStatus.OK, 'convert success', node);
});
