import mongoose, { Schema, Document, PaginateModel, Model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import DefaultData, { IDefaultData } from '../../defaultData';
import toJSON from '../../plugins/toJSON.plugin';

export interface IUser extends Document, IDefaultData {
  full_name: string;
  account_id: mongoose.Schema.Types.ObjectId;
}
export interface IUserDocument extends IUser, Document {}

export interface IUserModel extends Model<IUserDocument> {}
const userSchema = new Schema<IUser>({
  full_name: { type: String, required: true },
  account_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  ...DefaultData,
});

userSchema.plugin(mongoosePaginate);
userSchema.plugin(toJSON);
const User = mongoose.model<IUserDocument, PaginateModel<IUserDocument> & IUserModel>('users', userSchema, 'users');
export default User;
