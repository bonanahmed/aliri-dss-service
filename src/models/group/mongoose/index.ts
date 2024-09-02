import mongoose, { Schema, Document, PaginateModel, Model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import DefaultData, { IDefaultData } from '../../defaultData';
import toJSON from '../../plugins/toJSON.plugin';
// import paginate from '../../plugins/pagination.plugin';

export interface IGroup extends IDefaultData {
  name: string;
  period: string;
  area_id: mongoose.Schema.Types.ObjectId;
  plant_pattern_template_name_id?: mongoose.Schema.Types.ObjectId | null;
}

export interface IGroupDocument extends IGroup, Document {}

export interface IGroupModel extends Model<IGroupDocument> {}

const groupSchema = new Schema<IGroup>({
  name: { type: String, required: true },
  period: { type: String, required: true },
  area_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'areas' },
  plant_pattern_template_name_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: 'plant_pattern_template_names',
  },
  ...DefaultData,
});

groupSchema.plugin(mongoosePaginate);
groupSchema.plugin(toJSON);
groupSchema.pre('find', function (next) {
  // Use `populate()` to automatically populate the fields
  this.populate([{ path: 'plant_pattern_template_name_id', options: { strictPopulate: false } }]);
  next();
});
const Group = mongoose.model<IGroupDocument, PaginateModel<IGroupDocument> & IGroupModel>('groups', groupSchema, 'groups');
export default Group;
