import mongoose, { Schema, Document, PaginateModel, Model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import DefaultData, { IDefaultData } from '../../defaultData';
import toJSON from '../../plugins/toJSON.plugin';
// import paginate from '../../plugins/pagination.plugin';

export interface IArea extends IDefaultData {
  name: string;
  code: string;
  hierarchy_code?: string;
  type: string;
  link_google_map?: string;
  parent_id?: mongoose.Schema.Types.ObjectId | null;
  line_id?: mongoose.Schema.Types.ObjectId | null;
  detail: object;
  images?: any;
}

export interface IAreaDocument extends IArea, Document {}

export interface IAreaModel extends Model<IAreaDocument> {}

const areaSchema = new Schema<IArea>({
  name: { type: String, required: true },
  code: { type: String, required: true },
  hierarchy_code: { type: String, required: false },
  type: { type: String, required: true },
  link_google_map: { type: String, required: false },
  parent_id: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'areas' },
  line_id: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'lines' },
  detail: {
    group: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'groups' },
    standard_area: { type: Number, required: false },
    kemantren: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'kemantrens' },
    juru: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'accounts' },
  },
  images: { type: Array, required: false },

  ...DefaultData,
});

areaSchema.plugin(mongoosePaginate);
areaSchema.plugin(toJSON);
// areaSchema.pre('find', function (next) {
//   // Use `populate()` to automatically populate the fields
//   this.populate([
//     { path: 'parent_id', options: { strictPopulate: false } },
//     {
//       path: 'line_id',
//       options: { strictPopulate: false },
//       populate: { path: 'node_id', options: { strictPopulate: false } },
//     },
//   ]);
//   next();
// });
// areaSchema.pre('findOne', function (next) {
//   // Use `populate()` to automatically populate the fields
//   this.populate([{ path: 'detail.group', options: { strictPopulate: false } }]);
//   next();
// });
const Area = mongoose.model<IAreaDocument, PaginateModel<IAreaDocument> & IAreaModel>('areas', areaSchema, 'areas');
export default Area;
