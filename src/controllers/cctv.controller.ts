import httpStatus from 'http-status';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { cctvService } from '../services';
import ApiResponse from '../utils/ApiResponse';

export const getCCTV = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['search', 'type', 'parent_id', 'area_id']);
  const options = {
    ...pick(req.query, ['sortBy', 'limit', 'page']),
  };

  const result = await cctvService.getCCTV(filter, options);
  ApiResponse(res, httpStatus.OK, httpStatus[200], result);
});

export const generateLinkHikVision = catchAsync(async (req, res) => {
  const body = req.body;
  const result = await cctvService.generateLinkHikVision(body);
  ApiResponse(res, httpStatus.OK, httpStatus[200], result);
});
