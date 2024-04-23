import mongoose, { Schema, Document, PaginateModel, Model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import DefaultData, { IDefaultData } from '../../defaultData';
import toJSON from '../../plugins/toJSON.plugin';
// import paginate from '../../plugins/pagination.plugin';

export interface INodeToLineDataActual extends IDefaultData {
  actual_flow_value: number;
  actual_level_value: number | null;
  date: string;
  direction_line: mongoose.Schema.Types.ObjectId;
  node_id: mongoose.Schema.Types.ObjectId;
}

export interface INodeToLineDataActualDocument extends INodeToLineDataActual, Document {}

export interface INodeToLineDataActualModel extends Model<INodeToLineDataActualDocument> {}

const nodeToLineDataActualSchema = new Schema<INodeToLineDataActual>({
  actual_flow_value: { type: Number, required: true },
  actual_level_value: { type: Number, required: false },
  date: { type: String, required: true },
  direction_line: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'lines' },
  node_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'nodes' },
  ...DefaultData,
});

nodeToLineDataActualSchema.plugin(mongoosePaginate);
nodeToLineDataActualSchema.plugin(toJSON);

const NodeToLineDataActual = mongoose.model<
  INodeToLineDataActualDocument,
  PaginateModel<INodeToLineDataActualDocument> & INodeToLineDataActualModel
>('node_to_line_data_actuals', nodeToLineDataActualSchema, 'node_to_line_data_actuals');
export default NodeToLineDataActual;
