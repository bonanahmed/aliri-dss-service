import mongoose, { Schema, Document, PaginateModel, Model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import DefaultData, { IDefaultData } from '../../defaultData';
import toJSON from '../../plugins/toJSON.plugin';
// import paginate from '../../plugins/pagination.plugin';

export interface INodeSensor extends IDefaultData {
  sensor_name: string;
  sensor_type: string;
  sensor_code: string;
  sensor_value: string | null;
  operation_type: string;
  direction_line: mongoose.Schema.Types.ObjectId;
  node_id: mongoose.Schema.Types.ObjectId;
}

export interface INodeSensorDocument extends INodeSensor, Document {}

export interface INodeSensorModel extends Model<INodeSensorDocument> {}

const sensorSchema = new Schema<INodeSensor>({
  sensor_name: { type: String, required: true },
  sensor_type: { type: String, required: true },
  sensor_code: { type: String, required: true },
  sensor_value: { type: String, required: false },
  operation_type: { type: String, required: true },
  direction_line: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'lines' },
  node_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'nodes' },
  ...DefaultData,
});

sensorSchema.plugin(mongoosePaginate);
sensorSchema.plugin(toJSON);

const NodeSensor = mongoose.model<INodeSensorDocument, PaginateModel<INodeSensorDocument> & INodeSensorModel>(
  'node_sensors',
  sensorSchema,
  'node_sensors'
);
export default NodeSensor;
