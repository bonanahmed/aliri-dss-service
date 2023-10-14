import mongoose, { Schema, Document, PaginateModel, Model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import DefaultData, { IDefaultData } from '../../defaultData';
import toJSON from '../../plugins/toJSON.plugin';
// import paginate from '../../plugins/pagination.plugin';

export interface IPlantPatternTemplate extends IDefaultData {
  code: string;
  color: string;
  date: string;
  growth_time: string;
  pasten: number;
  actual_water_needed?: number;
  raw_material_area_planted?: number;
  water_flow?: number;
  plant_pattern_template_name_id: mongoose.Schema.Types.ObjectId;
}

export interface IPlantPatternTemplateDocument extends IPlantPatternTemplate, Document {}

export interface IPlantPatternTemplateModel extends Model<IPlantPatternTemplateDocument> {}

const plantPatternTemplatechema = new Schema<IPlantPatternTemplate>({
  code: { type: String, required: true },
  color: { type: String, required: true },
  date: { type: String, required: true },
  growth_time: { type: String, required: true },
  pasten: { type: Number, required: true },
  raw_material_area_planted: { type: Number, required: false },
  actual_water_needed: { type: Number, required: false },
  water_flow: { type: Number, required: false },
  plant_pattern_template_name_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'plant_pattern_template_names',
  },
  ...DefaultData,
});

plantPatternTemplatechema.plugin(mongoosePaginate);
plantPatternTemplatechema.plugin(toJSON);
plantPatternTemplatechema.pre('find', function (next) {
  // Use `populate()` to automatically populate the fields
  this.populate([{ path: 'plant_pattern_template_name_id', options: { strictPopulate: false } }]);
  next();
});
const PlantPatternTemplate = mongoose.model<
  IPlantPatternTemplateDocument,
  PaginateModel<IPlantPatternTemplateDocument> & IPlantPatternTemplateModel
>('plant_pattern_templates', plantPatternTemplatechema, 'plant_pattern_templates');
export default PlantPatternTemplate;
