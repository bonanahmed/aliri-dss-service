import mongoose, { Schema, Document, PaginateModel, Model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import DefaultData, { IDefaultData } from '../../defaultData';
import toJSON from '../../plugins/toJSON.plugin';
// import paginate from '../../plugins/pagination.plugin';

export interface IKemantren extends IDefaultData {
  name: string;
  area_id: mongoose.Schema.Types.ObjectId | null;
}

export interface IKemantrenDocument extends IKemantren, Document {}

export interface IKemantrenModel extends Model<IKemantrenDocument> {}

const kemantrenSchema = new Schema<IKemantren>({
  name: { type: String, required: true },
  area_id: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'areas' },
  ...DefaultData,
});

kemantrenSchema.plugin(mongoosePaginate);
// kemantrenSchema.plugin(paginate);
kemantrenSchema.plugin(toJSON);
const Kemantren = mongoose.model<IKemantrenDocument, PaginateModel<IKemantrenDocument> & IKemantrenModel>(
  'kemantrens',
  kemantrenSchema,
  'kemantrens'
);
export default Kemantren;
