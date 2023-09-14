import mongoose, { Document, Model, Schema, PaginateModel } from 'mongoose';
import DefaultData, { IDefaultData } from '../../defaultData';
import validator from 'validator';
import toJSON from '../../plugins/toJSON.plugin';
// import paginate from "../../plugins/pagination.plugin";
import mongoosePaginate from 'mongoose-paginate-v2';

import bcrypt from 'bcrypt';

export interface IAccount extends IDefaultData {
  username: string;
  email?: string;
  password: string;
  role: string;
}

export interface IAccountDocument extends IAccount, Document {
  isPasswordMatch: (password: string) => Promise<boolean>;
}

export interface IAccountModel extends Model<IAccountDocument> {
  findByUsername: (username: string) => Promise<IAccountDocument>;
  isUsernameTaken: (username: string, excludeUserId?: string) => Promise<boolean>;
}

const accountSchema = new Schema<IAccount>({
  username: { type: String, required: true, max: 255 },
  email: {
    type: String,
    required: false,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value: string) {
      if (!validator.isEmail(value)) {
        throw new Error('Invalid email');
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
    validate(value: string) {
      if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
        throw new Error('Password must contain at least one letter and one number');
      }
    },
  },
  role: {
    type: String,
    // enum: roles,
    default: 'user',
  },

  ...DefaultData,
});

accountSchema.plugin(toJSON);
// accountSchema.plugin(paginate);
accountSchema.plugin(mongoosePaginate);
/**
 * Check if username is taken
 * @param {string} username - The user's username
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
accountSchema.statics.isUsernameTaken = async function (username, excludeUserId) {
  const account = await this.findOne({ username, _id: { $ne: excludeUserId } });
  return !!account;
};

/**
 * Check if username is taken
 * @param {string} username - The user's username
 * @returns {Promise<IAccountDocument>}
 */
accountSchema.statics.findByUsername = function (username: string): Promise<IAccountDocument> {
  return this.findOne({ username });
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
accountSchema.methods.isPasswordMatch = async function (password: string) {
  const account = this;
  return bcrypt.compare(password, account.password);
};

accountSchema.pre('save', async function (next) {
  const account = this;
  if (account.isModified('password')) {
    account.password = await bcrypt.hash(account.password, 8);
  }
  next();
});

const Account = mongoose.model<IAccountDocument, PaginateModel<IAccountDocument> & IAccountModel>(
  'accounts',
  accountSchema,
  'accounts'
);
export default Account;
