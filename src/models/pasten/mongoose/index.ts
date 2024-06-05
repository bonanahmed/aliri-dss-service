import mongoose, { Schema, Document, PaginateModel, Model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import DefaultData, { IDefaultData } from '../../defaultData';
import toJSON from '../../plugins/toJSON.plugin';
// import paginate from '../../plugins/pagination.plugin';

export interface IPasten extends IDefaultData {
  color: string;
  code: string;
  plant_type: string;
  growth_time: string;
  pasten: number;
  actual_water_needed?: number | 0;
  raw_material_area_planted?: number | 0;
  water_flow?: number | 0;
  area_id: mongoose.Schema.Types.ObjectId;
}

export interface IPastenDocument extends IPasten, Document {}

export interface IPastenModel extends Model<IPastenDocument> {}

const pastenSchema = new Schema<IPasten>({
  color: { type: String, required: true },
  code: { type: String, required: true },
  plant_type: { type: String, required: true },
  growth_time: { type: String, required: true },
  pasten: { type: Number, required: true },
  actual_water_needed: { type: Number, required: false },
  raw_material_area_planted: { type: Number, required: false },
  water_flow: { type: Number, required: false },
  area_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'areas' },

  ...DefaultData,
});

pastenSchema.plugin(mongoosePaginate);
// pastenSchema.plugin(paginate);
pastenSchema.plugin(toJSON);
const Pasten = mongoose.model<IPastenDocument, PaginateModel<IPastenDocument> & IPastenModel>(
  'pastens',
  pastenSchema,
  'pastens'
);
export default Pasten;
