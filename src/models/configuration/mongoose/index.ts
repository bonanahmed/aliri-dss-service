import mongoose, { Schema, Document, PaginateModel, Model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import DefaultData, { IDefaultData } from '../../defaultData';
import toJSON from '../../plugins/toJSON.plugin';
// import paginate from '../../plugins/pagination.plugin';

export interface IConfiguration extends IDefaultData {
  key: string;
  value: string;
  label: string;
}

export interface IConfigurationDocument extends IConfiguration, Document {}

export interface IConfigurationModel extends Model<IConfigurationDocument> {}

const configurationSchema = new Schema<IConfiguration>({
  key: { type: String, required: true, unique: true },
  label: { type: String, required: true },
  value: { type: String, required: true },
  ...DefaultData,
});

configurationSchema.plugin(mongoosePaginate);
configurationSchema.plugin(toJSON);

const Configuration = mongoose.model<IConfigurationDocument, PaginateModel<IConfigurationDocument> & IConfigurationModel>(
  'configurations',
  configurationSchema,
  'configurations'
);
export default Configuration;
