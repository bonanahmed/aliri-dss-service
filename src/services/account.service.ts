import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import { Account } from '../models/account';
import { User } from '../models/user';

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<any>}
 */
const getAccountsAndUsers = async (filter: any, options: any): Promise<any> => {
  filter.$and = [{ role: { $ne: 'superadmin' } }];
  if (filter.search) {
    filter.$or = [
      { name: { $regex: new RegExp(filter.search, 'i') } },
      { email: { $regex: new RegExp(filter.search, 'i') } },
    ];
    delete filter.search;
  }
  let accounts: any = options.limit ? await Account.paginate(filter, options) : await Account.find(filter);
  const listAccount = options.limit ? accounts.docs : accounts;
  const accountResult = await Promise.all(
    listAccount.map(async (account: any) => {
      const user = await User.findOne({ account_id: account.id });
      return {
        account,
        user,
      };
    })
  );

  const result = options.limit
    ? {
        ...accounts,
        docs: accountResult,
      }
    : accountResult;

  return result;
};

/**
 * Get account and user by account_id
 * @param {string} id
 * @returns {Promise<any | null>} // Return null if account not found
 */
const getAccountAndUserById = async (id: string): Promise<{ account: any | null; user: any | null } | null> => {
  const account = await Account.findById(id);
  const user = await User.findOne({ account_id: id });
  const result = {
    account,
    user,
  };
  return result;
};

/**
 * Update account by id
 * @param {string} id
 * @param {Object} updateBody
 * @returns {Promise<any>} // You can change the return type as per your requirements
 */
const updateAccountAndUserById = async (id: string, updateBody: any): Promise<any> => {
  const account = await Account.findById(id);
  const user = await User.findOne({ account_id: id });
  if (!account && !user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User Or Account not found');
  }

  // Update the account object with the provided updateBody
  if (account) {
    Object.assign(account, updateBody);
    await account.save();
  }

  // Update the user object with the provided updateBody
  if (user) {
    Object.assign(user, updateBody);
    await user.save();
  }

  // Construct the return object, excluding the password field from account
  const returnObject = {
    account: account ? { ...account.toObject(), password: undefined } : undefined,
    user,
  };

  return returnObject;
};

/**
 * Delete account by id
 * @param {string} id
 * @returns {Promise<any>} // You can change the return type as per your requirements
 */
const deleteAccountAndUser = async (id: string): Promise<any> => {
  const account = await Account.findById(id);
  const user = await User.findOne({ account_id: id });
  if (!account && !user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Account not found');
  }
  await Account.findByIdAndRemove(id);
  await User.findOneAndRemove({ account_id: id });
  return { account, user };
};

export { getAccountsAndUsers, getAccountAndUserById, updateAccountAndUserById, deleteAccountAndUser };
