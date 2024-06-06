import httpStatus from 'http-status';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { configurationService } from '../services';
import ApiResponse from '../utils/ApiResponse';

const createConfiguration = catchAsync(async (req, res) => {
  const configuration = await configurationService.createConfiguration(req.body);
  // res.status(httpStatus.CREATED).send(user);
  ApiResponse(res, httpStatus.CREATED, 'create success', configuration);
});

const getConfigurations = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['search']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await configurationService.getConfigurations(filter, options);
  // res.send(result);
  ApiResponse(res, httpStatus.OK, httpStatus[200], result);
});

const getConfiguration = catchAsync(async (req, res) => {
  const configuration = await configurationService.getConfigurationById(req.params.configurationId);
  if (!configuration) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Configuration not found');
  }
  ApiResponse(res, httpStatus.OK, httpStatus[200], configuration);
});

const updateConfiguration = catchAsync(async (req, res) => {
  const configuration = await configurationService.updateConfigurationById(req.params.configurationId, req.body);
  ApiResponse(res, httpStatus.OK, 'update success', configuration);
});

const deleteConfiguration = catchAsync(async (req, res) => {
  const configuration = await configurationService.deleteConfigurationById(req.params.configurationId);
  // res.status(httpStatus.NO_CONTENT).send();
  ApiResponse(res, httpStatus.OK, 'delete success', configuration);
});

export { createConfiguration, getConfigurations, getConfiguration, updateConfiguration, deleteConfiguration };
