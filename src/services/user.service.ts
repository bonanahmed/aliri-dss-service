import httpStatus from "http-status";
import ApiError from "../utils/ApiError";
import { User } from "../models/user";

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<any>}
 */
const createUser = async (userBody: any): Promise<any> => {
  return await User.create(userBody);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const getUsers = async (filter: any, options: any): Promise<any> => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {string} id
 * @returns {Promise<any | null>} // Return null if user not found
 */
const getUserById = async (id: string) => {
  return await User.findById(id);
};

/**
 * Update user by id
 * @param {string} userId
 * @param {Object} updateBody
 * @returns {Promise<any>} // You can change the return type as per your requirements
 */
const updateUserById = async (
  userId: string,
  updateBody: any
): Promise<any> => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {string} userId
 * @returns {Promise<any>} // You can change the return type as per your requirements
 */
const deleteUserById = async (userId: string): Promise<any> => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  await User.findByIdAndRemove(userId);
  return user;
};

export { createUser, getUsers, getUserById, updateUserById, deleteUserById };
