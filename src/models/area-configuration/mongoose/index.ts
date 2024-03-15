import mongoose, { Schema, Document, PaginateModel, Model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import DefaultData, { IDefaultData } from '../../defaultData';
import toJSON from '../../plugins/toJSON.plugin';
// import paginate from '../../plugins/pagination.plugin';

export interface IAreaConfiguration extends IDefaultData {
  key: string;
  value: string;
  label: string;
  area_id: mongoose.Schema.Types.ObjectId;
}

export interface IAreaConfigurationDocument extends IAreaConfiguration, Document {}

export interface IAreaConfigurationModel extends Model<IAreaConfigurationDocument> {}

const configurationSchema = new Schema<IAreaConfiguration>({
  key: { type: String, required: true, unique: true },
  label: { type: String, required: true },
  value: { type: String, required: true },
  area_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'areas' },
  ...DefaultData,
});

configurationSchema.plugin(mongoosePaginate);
configurationSchema.plugin(toJSON);

const AreaConfiguration = mongoose.model<
  IAreaConfigurationDocument,
  PaginateModel<IAreaConfigurationDocument> & IAreaConfigurationModel
>('area_configurations', configurationSchema, 'area_configurations');
export default AreaConfiguration;
