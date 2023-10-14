import httpStatus from 'http-status';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { pastenService } from '../services';
import ApiResponse from '../utils/ApiResponse';

const createPasten = catchAsync(async (req, res) => {
  const pasten = await pastenService.createPasten(req.body);
  // res.status(httpStatus.CREATED).send(user);
  ApiResponse(res, httpStatus.CREATED, 'create success', pasten);
});

const getPastens = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await pastenService.getPastens(filter, options);
  // res.send(result);
  ApiResponse(res, httpStatus.OK, httpStatus[200], result);
});

const getPasten = catchAsync(async (req, res) => {
  const pasten = await pastenService.getPastenById(req.params.pastenId);
  if (!pasten) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Pasten not found');
  }
  ApiResponse(res, httpStatus.OK, httpStatus[200], pasten);
});

const updatePasten = catchAsync(async (req, res) => {
  const pasten = await pastenService.updatePastenById(req.params.pastenId, req.body);
  ApiResponse(res, httpStatus.OK, 'update success', pasten);
});

const deletePasten = catchAsync(async (req, res) => {
  const pasten = await pastenService.deletePastenById(req.params.pastenId);
  // res.status(httpStatus.NO_CONTENT).send();
  ApiResponse(res, httpStatus.OK, 'delete success', pasten);
});

export { createPasten, getPastens, getPasten, updatePasten, deletePasten };
