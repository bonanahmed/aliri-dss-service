import mongoose, { Schema, Document, PaginateModel, Model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import DefaultData, { IDefaultData } from '../../defaultData';
import toJSON from '../../plugins/toJSON.plugin';
// import paginate from '../../plugins/pagination.plugin';

export interface IPlantPatternPlanning extends IDefaultData {
  code: string;
  color: string;
  date: string;
  growth_time: string;
  pasten: number;
  actual_water_needed?: number;
  raw_material_area_planted?: number;
  water_flow?: number;
  template_id: mongoose.Schema.Types.ObjectId;
}

export interface IPlantPatternPlanningDocument extends IPlantPatternPlanning, Document {}

export interface IPlantPatternPlanningModel extends Model<IPlantPatternPlanningDocument> {}

const plantPatternPlanningSchema = new Schema<IPlantPatternPlanning>({
  code: { type: String, required: true },
  color: { type: String, required: true },
  date: { type: String, required: true },
  growth_time: { type: String, required: true },
  pasten: { type: Number, required: true },
  raw_material_area_planted: { type: Number, required: false },
  actual_water_needed: { type: Number, required: false },
  water_flow: { type: Number, required: false },
  template_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'plant_pattern_templates' },

  ...DefaultData,
});

plantPatternPlanningSchema.plugin(mongoosePaginate);
// plantPatternPlanningSchema.plugin(paginate);
plantPatternPlanningSchema.plugin(toJSON);
const PlantPatternPlanning = mongoose.model<
  IPlantPatternPlanningDocument,
  PaginateModel<IPlantPatternPlanningDocument> & IPlantPatternPlanningModel
>('plant_pattern_plannings', plantPatternPlanningSchema, 'plant_pattern_plannings');
export default PlantPatternPlanning;
