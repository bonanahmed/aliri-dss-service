import httpStatus from 'http-status';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { groupService } from '../services';
import ApiResponse from '../utils/ApiResponse';

const createGroup = catchAsync(async (req, res) => {
  const group = await groupService.createGroup(req.body);
  // res.status(httpStatus.CREATED).send(user);
  ApiResponse(res, httpStatus.CREATED, 'create success', group);
});

const getGroups = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['search']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await groupService.getGroups(filter, options);
  // res.send(result);
  ApiResponse(res, httpStatus.OK, httpStatus[200], result);
});
const getGroupsWithPlantPattern = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['search']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await groupService.getGroupsWithPlantPattern(filter, options);
  // res.send(result);
  ApiResponse(res, httpStatus.OK, httpStatus[200], result);
});

const getGroup = catchAsync(async (req, res) => {
  const group = await groupService.getGroupById(req.params.groupId);
  if (!group) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Group not found');
  }
  ApiResponse(res, httpStatus.OK, httpStatus[200], group);
});

const updateGroup = catchAsync(async (req, res) => {
  const group = await groupService.updateGroupById(req.params.groupId, req.body);
  ApiResponse(res, httpStatus.OK, 'update success', group);
});

const deleteGroup = catchAsync(async (req, res) => {
  const group = await groupService.deleteGroupById(req.params.groupId);
  // res.status(httpStatus.NO_CONTENT).send();
  ApiResponse(res, httpStatus.OK, 'delete success', group);
});

export { createGroup, getGroups, getGroupsWithPlantPattern, getGroup, updateGroup, deleteGroup };
