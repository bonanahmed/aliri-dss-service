import mongoose, { Schema, Document, PaginateModel, Model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import DefaultData, { IDefaultData } from '../../defaultData';
import toJSON from '../../plugins/toJSON.plugin';

export interface IUser extends Document, IDefaultData {
  account_id: mongoose.Schema.Types.ObjectId;
  gender: string;
  address: Object;
  ktp?: string;
  blood_type?: string;
}
export interface IUserDocument extends IUser, Document {}

export interface IUserModel extends Model<IUserDocument> {}
const userSchema = new Schema<IUser>({
  account_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  ktp: { type: String, required: false },
  gender: { type: String, required: true },
  address: { type: Object, required: true },
  blood_type: { type: String, required: false },
  ...DefaultData,
});

userSchema.plugin(mongoosePaginate);
userSchema.plugin(toJSON);
const User = mongoose.model<IUserDocument, PaginateModel<IUserDocument> & IUserModel>('users', userSchema, 'users');
export default User;
