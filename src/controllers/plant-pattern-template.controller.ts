import httpStatus from 'http-status';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { plantPatternTemplateService } from '../services';
import ApiResponse from '../utils/ApiResponse';

const createPlantPatternTemplate = catchAsync(async (req, res) => {
  const plantPatternTemplate = await plantPatternTemplateService.createPlantPatternTemplate(req.body);
  // res.status(httpStatus.CREATED).send(user);
  ApiResponse(res, httpStatus.CREATED, 'create success', plantPatternTemplate);
});

const getPlantPatternTemplates = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['search']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await plantPatternTemplateService.getPlantPatternTemplates(filter, options);
  // res.send(result);
  ApiResponse(res, httpStatus.OK, httpStatus[200], result);
});

const getPlantPatternTemplate = catchAsync(async (req, res) => {
  const plantPatternTemplate = await plantPatternTemplateService.getPlantPatternTemplateById(
    req.params.plantPatternTemplateId
  );
  if (!plantPatternTemplate) {
    throw new ApiError(httpStatus.NOT_FOUND, 'PlantPatternTemplate not found');
  }
  ApiResponse(res, httpStatus.OK, httpStatus[200], plantPatternTemplate);
});

const updatePlantPatternTemplate = catchAsync(async (req, res) => {
  const plantPatternTemplate = await plantPatternTemplateService.updatePlantPatternTemplateById(
    req.params.plantPatternTemplateId,
    req.body
  );
  ApiResponse(res, httpStatus.OK, 'update success', plantPatternTemplate);
});

const deletePlantPatternTemplate = catchAsync(async (req, res) => {
  const plantPatternTemplate = await plantPatternTemplateService.deletePlantPatternTemplateById(
    req.params.plantPatternTemplateId
  );
  // res.status(httpStatus.NO_CONTENT).send();
  ApiResponse(res, httpStatus.OK, 'delete success', plantPatternTemplate);
});

export {
  createPlantPatternTemplate,
  getPlantPatternTemplates,
  getPlantPatternTemplate,
  updatePlantPatternTemplate,
  deletePlantPatternTemplate,
};
