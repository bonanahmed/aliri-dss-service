import httpStatus from 'http-status';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { kemantrenService } from '../services';
import ApiResponse from '../utils/ApiResponse';

const createKemantren = catchAsync(async (req, res) => {
  const kemantren = await kemantrenService.createKemantren(req.body);
  // res.status(httpStatus.CREATED).send(user);
  ApiResponse(res, httpStatus.CREATED, 'create success', kemantren);
});

const getKemantrens = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await kemantrenService.getKemantrens(filter, options);
  // res.send(result);
  ApiResponse(res, httpStatus.OK, httpStatus[200], result);
});

const getKemantren = catchAsync(async (req, res) => {
  const kemantren = await kemantrenService.getKemantrenById(req.params.kemantrenId);
  if (!kemantren) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Kemantren not found');
  }
  ApiResponse(res, httpStatus.OK, httpStatus[200], kemantren);
});

const updateKemantren = catchAsync(async (req, res) => {
  const kemantren = await kemantrenService.updateKemantrenById(req.params.kemantrenId, req.body);
  ApiResponse(res, httpStatus.OK, 'update success', kemantren);
});

const deleteKemantren = catchAsync(async (req, res) => {
  const kemantren = await kemantrenService.deleteKemantrenById(req.params.kemantrenId);
  // res.status(httpStatus.NO_CONTENT).send();
  ApiResponse(res, httpStatus.OK, 'delete success', kemantren);
});

export { createKemantren, getKemantrens, getKemantren, updateKemantren, deleteKemantren };
