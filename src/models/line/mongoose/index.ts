import mongoose, { Schema, Document, PaginateModel, Model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import DefaultData, { IDefaultData } from '../../defaultData';
import toJSON from '../../plugins/toJSON.plugin';
// import paginate from '../../plugins/pagination.plugin';

export interface ILine extends IDefaultData {
  name: string;
  code: string;
  hierarchy_code?: string;
  type: string;
  node_id?: mongoose.Schema.Types.ObjectId | null;
  area_id?: mongoose.Schema.Types.ObjectId | null;
  detail: object;
  images?: any;
}

export interface ILineDocument extends ILine, Document {}

export interface ILineModel extends Model<ILineDocument> {}

const lineSchema = new Schema<ILine>({
  name: { type: String, required: true },
  code: { type: String, required: true },
  hierarchy_code: { type: String, required: false },
  images: { type: Array, required: false },

  type: { type: String, required: true },
  area_id: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'areas' },
  node_id: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'nodes' },
  detail: { type: Object, required: false },
  ...DefaultData,
});

lineSchema.plugin(mongoosePaginate);
lineSchema.plugin(toJSON);
// lineSchema.pre('find', function (next) {
//   // Use `populate()` to automatically populate the fields
//   this.populate([
//     {
//       path: 'node_id',
//       options: { strictPopulate: false },
//       populate: { path: 'line_id', options: { strictPopulate: false } },
//     },
//   ]);
//   next();
// });
const Line = mongoose.model<ILineDocument, PaginateModel<ILineDocument> & ILineModel>('lines', lineSchema, 'lines');
export default Line;
