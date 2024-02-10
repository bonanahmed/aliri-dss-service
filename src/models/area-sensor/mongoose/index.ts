import mongoose, { Schema, Document, PaginateModel, Model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import DefaultData, { IDefaultData } from '../../defaultData';
import toJSON from '../../plugins/toJSON.plugin';
// import paginate from '../../plugins/pagination.plugin';

export interface IAreaSensor extends IDefaultData {
  sensor_name: string;
  sensor_type: string;
  sensor_code: string;
  sensor_value: string | null;
  operation_type: string;
  area_id: mongoose.Schema.Types.ObjectId;
}

export interface IAreaSensorDocument extends IAreaSensor, Document {}

export interface IAreaSensorModel extends Model<IAreaSensorDocument> {}

const sensorSchema = new Schema<IAreaSensor>({
  sensor_name: { type: String, required: true },
  sensor_type: { type: String, required: true },
  sensor_code: { type: String, required: true },
  sensor_value: { type: String, required: false },
  operation_type: { type: String, required: true },
  area_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'areas' },
  ...DefaultData,
});

sensorSchema.plugin(mongoosePaginate);
sensorSchema.plugin(toJSON);

const AreaSensor = mongoose.model<IAreaSensorDocument, PaginateModel<IAreaSensorDocument> & IAreaSensorModel>(
  'area_sensors',
  sensorSchema,
  'area_sensors'
);
export default AreaSensor;
