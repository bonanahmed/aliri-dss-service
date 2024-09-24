import mongoose, { Schema, Document, PaginateModel, Model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import DefaultData, { IDefaultData } from '../../defaultData';
import toJSON from '../../plugins/toJSON.plugin';
// import paginate from '../../plugins/pagination.plugin';

export interface IAreaDetail extends IDefaultData {
  description: string;
  area_id: mongoose.Schema.Types.ObjectId;
}

export interface IAreaDetailDocument extends IAreaDetail, Document {}

export interface IAreaDetailModel extends Model<IAreaDetailDocument> {}

const areaDetailSchema = new Schema<IAreaDetail>({
  description: { type: String, required: true },
  area_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'areas' },
  ...DefaultData,
});

areaDetailSchema.plugin(mongoosePaginate);
areaDetailSchema.plugin(toJSON);
const AreaDetail = mongoose.model<IAreaDetailDocument, PaginateModel<IAreaDetailDocument> & IAreaDetailModel>(
  'area_details',
  areaDetailSchema,
  'area_details'
);
export default AreaDetail;
