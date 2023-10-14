import mongoose, { Schema, Document, PaginateModel, Model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import DefaultData, { IDefaultData } from '../../defaultData';
import toJSON from '../../plugins/toJSON.plugin';
// import paginate from '../../plugins/pagination.plugin';

export interface IPlantPattern extends IDefaultData {
  code: string;
  color: string;
  date: string;
  growth_time: string;
  pasten: number;
  actual_water_needed: number;
  raw_material_area_planted: number;
  water_flow?: number;
  area_id: mongoose.Schema.Types.ObjectId;
}

export interface IPlantPatternDocument extends IPlantPattern, Document {}

export interface IPlantPatternModel extends Model<IPlantPatternDocument> {}

const patternSchema = new Schema<IPlantPattern>({
  code: { type: String, required: true },
  color: { type: String, required: true },
  date: { type: String, required: true },
  growth_time: { type: String, required: true },
  pasten: { type: Number, required: true },
  raw_material_area_planted: { type: Number, required: false },
  actual_water_needed: { type: Number, required: false },
  water_flow: { type: Number, required: false },
  area_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'areas' },

  ...DefaultData,
});

patternSchema.plugin(mongoosePaginate);
// patternSchema.plugin(paginate);
patternSchema.plugin(toJSON);
const PlantPattern = mongoose.model<IPlantPatternDocument, PaginateModel<IPlantPatternDocument> & IPlantPatternModel>(
  'plant_patterns',
  patternSchema,
  'plant_patterns'
);
export default PlantPattern;
