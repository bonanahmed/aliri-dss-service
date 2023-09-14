import mongoose, { Schema, Document, PaginateModel, Model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import DefaultData, { IDefaultData } from '../../defaultData';
import toJSON from '../../plugins/toJSON.plugin';
// import paginate from '../../plugins/pagination.plugin';

export interface ITemplate extends IDefaultData {
  inputField1: string;
  numberField2: number;
  booleanField3: boolean;
  optionField4: string;
}

export interface ITemplateDocument extends ITemplate, Document {}

export interface ITemplateModel extends Model<ITemplateDocument> {}

const templateSchema = new Schema<ITemplate>({
  inputField1: { type: String, required: true },
  numberField2: { type: Number, required: true },
  booleanField3: { type: Boolean, required: true },
  optionField4: { type: String, required: true },
  ...DefaultData,
});

templateSchema.plugin(mongoosePaginate);
// templateSchema.plugin(paginate);
templateSchema.plugin(toJSON);
const Template = mongoose.model<ITemplateDocument, PaginateModel<ITemplateDocument> & ITemplateModel>(
  'templates',
  templateSchema,
  'templates'
);
export default Template;
