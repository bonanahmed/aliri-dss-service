import mongoose, { Schema, Document, PaginateModel, Model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import DefaultData, { IDefaultData } from '../../defaultData';
import toJSON from '../../plugins/toJSON.plugin';
// import paginate from '../../plugins/pagination.plugin';

export interface IAreaDocumentData extends IDefaultData {
  name: string;
  type: string;
  size: string;
  content: string | null;
  area_id: mongoose.Schema.Types.ObjectId;
}

export interface IAreaDocumentDataDocument extends IAreaDocumentData, Document {}

export interface IAreaDocumentDataModel extends Model<IAreaDocumentDataDocument> {}

const documentSchema = new Schema<IAreaDocumentData>({
  name: { type: String, required: true },
  type: { type: String, required: true },
  size: { type: String, required: true },
  content: { type: String, required: false },
  area_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'areas' },
  ...DefaultData,
});

documentSchema.plugin(mongoosePaginate);
documentSchema.plugin(toJSON);

const AreaDocumentData = mongoose.model<
  IAreaDocumentDataDocument,
  PaginateModel<IAreaDocumentDataDocument> & IAreaDocumentDataModel
>('area_documents', documentSchema, 'area_documents');
export default AreaDocumentData;
