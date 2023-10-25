import httpStatus from 'http-status';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { areaService } from '../services';
import ApiResponse from '../utils/ApiResponse';

const createArea = catchAsync(async (req, res) => {
  const area = await areaService.createArea(req.body);
  ApiResponse(res, httpStatus.CREATED, 'create success', area);
});

const getAreas = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['search', 'type', 'parent_id']);
  const options = {
    ...pick(req.query, ['sortBy', 'limit', 'page']),
  };

  const result = await areaService.getAreas(filter, options);
  ApiResponse(res, httpStatus.OK, httpStatus[200], result);
});

const getArea = catchAsync(async (req, res) => {
  const area = await areaService.getAreaById(req.params.areaId);
  if (!area) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Area not found');
  }
  ApiResponse(res, httpStatus.OK, httpStatus[200], area);
});

const updateArea = catchAsync(async (req, res) => {
  const area = await areaService.updateAreaById(req.params.areaId, req.body);
  ApiResponse(res, httpStatus.OK, 'update success', area);
});

const deleteArea = catchAsync(async (req, res) => {
  const area = await areaService.deleteAreaById(req.params.areaId);
  ApiResponse(res, httpStatus.OK, 'delete success', area);
});

export { createArea, getAreas, getArea, updateArea, deleteArea };
