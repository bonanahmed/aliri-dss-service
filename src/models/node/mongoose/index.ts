import mongoose, { Schema, Document, PaginateModel, Model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import DefaultData, { IDefaultData } from '../../defaultData';
import toJSON from '../../plugins/toJSON.plugin';
// import paginate from '../../plugins/pagination.plugin';

export interface INode extends IDefaultData {
  name: string;
  code: string;
  hierarchy_code?: string;
  type: string;
  parent_id?: mongoose.Schema.Types.ObjectId | null;
  prev_id?: mongoose.Schema.Types.ObjectId | null;
  line_id?: mongoose.Schema.Types.ObjectId | null;
  area_id?: mongoose.Schema.Types.ObjectId | null;
  detail?: object;
  images?: [];
  rating_curve_table?: [];
}

export interface INodeDocument extends INode, Document {}

export interface INodeModel extends Model<INodeDocument> {}

const nodeSchema = new Schema<INode>({
  name: { type: String, required: true },
  code: { type: String, required: true },
  hierarchy_code: { type: String, required: false },
  type: { type: String, required: true },
  parent_id: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'nodes' },
  line_id: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'lines' },
  images: { type: Array, required: false },
  rating_curve_table: { type: Array, required: false },
  detail: { type: Object, required: false },
  prev_id: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'nodes' },
  area_id: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'areas' },
  ...DefaultData,
});

nodeSchema.plugin(mongoosePaginate);
// nodeSchema.plugin(paginate);
nodeSchema.plugin(toJSON);

// nodeSchema.pre('find', function (next) {
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
const Node = mongoose.model<INodeDocument, PaginateModel<INodeDocument> & INodeModel>('nodes', nodeSchema, 'nodes');
export default Node;
