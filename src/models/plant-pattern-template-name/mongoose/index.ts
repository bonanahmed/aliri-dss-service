import mongoose, { Schema, Document, PaginateModel, Model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import DefaultData, { IDefaultData } from '../../defaultData';
import toJSON from '../../plugins/toJSON.plugin';
// import paginate from '../../plugins/pagination.plugin';

export interface IPlantPatternTemplateName extends IDefaultData {
  name: string;
  area_id: mongoose.Schema.Types.ObjectId;
}

export interface IPlantPatternTemplateNameDocument extends IPlantPatternTemplateName, Document {}

export interface IPlantPatternTemplateNameModel extends Model<IPlantPatternTemplateNameDocument> {}

const plantPatternTemplateNameSchema = new Schema<IPlantPatternTemplateName>({
  name: { type: String, required: true },
  area_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'areas' },
  ...DefaultData,
});

plantPatternTemplateNameSchema.plugin(mongoosePaginate);
plantPatternTemplateNameSchema.plugin(toJSON);

const PlantPatternTemplateName = mongoose.model<
  IPlantPatternTemplateNameDocument,
  PaginateModel<IPlantPatternTemplateNameDocument> & IPlantPatternTemplateNameModel
>('plant_pattern_template_names', plantPatternTemplateNameSchema, 'plant_pattern_template_names');
export default PlantPatternTemplateName;
