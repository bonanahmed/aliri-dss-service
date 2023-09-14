import httpStatus from "http-status";
import pick from "../utils/pick";
import ApiError from "../utils/ApiError";
import catchAsync from "../utils/catchAsync";
import { userService } from "../services";
import ApiResponse from "../utils/ApiResponse";

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  // res.status(httpStatus.CREATED).send(user);
  ApiResponse(res, httpStatus.CREATED, "create success", user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["name", "role"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await userService.getUsers(filter, options);
  // res.send(result);
  ApiResponse(res, httpStatus.OK, httpStatus[200], result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  ApiResponse(res, httpStatus.OK, httpStatus[200], user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  ApiResponse(res, httpStatus.OK, "update success", user);
});

const deleteUser = catchAsync(async (req, res) => {
  const user = await userService.deleteUserById(req.params.userId);
  // res.status(httpStatus.NO_CONTENT).send();
  ApiResponse(res, httpStatus.OK, "delete success", user);
});

export { createUser, getUsers, getUser, updateUser, deleteUser };
