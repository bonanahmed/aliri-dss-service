import httpStatus from 'http-status';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { plantPatternService } from '../services';
import ApiResponse from '../utils/ApiResponse';

const savePlantPattern = catchAsync(async (req, res) => {
  const { body } = req;
  const { date } = req.query;
  await plantPatternService.savePlantPattern(body, date as string);
  ApiResponse(res, httpStatus.CREATED, 'save success');
});

const getPlantPatterns = catchAsync(async (req, res) => {
  const { date } = req.query;
  const filter = pick(req.query, ['type', 'line_id', 'group_id', 'parent_id']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const result = await plantPatternService.getPlantPatterns(filter, options, date);
  ApiResponse(res, httpStatus.OK, httpStatus[200], result);
});

const getPlantPattern = catchAsync(async (req, res) => {
  const plantPattern = await plantPatternService.getPlantPatternById(req.params.plantPatternId);
  if (!plantPattern) {
    throw new ApiError(httpStatus.NOT_FOUND, 'PlantPattern not found');
  }
  ApiResponse(res, httpStatus.OK, httpStatus[200], plantPattern);
});

const deletePlantPattern = catchAsync(async (req, res) => {
  const plantPattern = await plantPatternService.deletePlantPatternById(req.params.plantPatternId);
  ApiResponse(res, httpStatus.OK, 'delete success', plantPattern);
});

export { savePlantPattern, getPlantPatterns, getPlantPattern, deletePlantPattern };
