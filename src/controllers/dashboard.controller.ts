import httpStatus from 'http-status';
import pick from '../utils/pick';
import catchAsync from '../utils/catchAsync';
import { dashboardService } from '../services';
import ApiResponse from '../utils/ApiResponse';

export const getDashboard = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const result = await dashboardService.getDashboard();
  ApiResponse(res, httpStatus.OK, httpStatus[200], result);
});
