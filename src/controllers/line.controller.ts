import httpStatus from 'http-status';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { lineService } from '../services';
import ApiResponse from '../utils/ApiResponse';

const createLine = catchAsync(async (req, res) => {
  const line = await lineService.createLine(req.body);
  ApiResponse(res, httpStatus.CREATED, 'create success', line);
});

const getLines = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['search', 'type', 'node_id']);
  const options = {
    ...pick(req.query, ['sortBy', 'limit', 'page']),
  };
  const result = await lineService.getLines(filter, options);
  ApiResponse(res, httpStatus.OK, httpStatus[200], result);
});

const getLine = catchAsync(async (req, res) => {
  const line = await lineService.getLineById(req.params.lineId);
  if (!line) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Line not found');
  }
  ApiResponse(res, httpStatus.OK, httpStatus[200], line);
});

const updateLine = catchAsync(async (req, res) => {
  const line = await lineService.updateLineById(req.params.lineId, req.body);
  ApiResponse(res, httpStatus.OK, 'update success', line);
});

const deleteLine = catchAsync(async (req, res) => {
  const line = await lineService.deleteLineById(req.params.lineId);
  ApiResponse(res, httpStatus.OK, 'delete success', line);
});

export { createLine, getLines, getLine, updateLine, deleteLine };
