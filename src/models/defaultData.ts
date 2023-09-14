export interface IDefaultData {
  created_at?: Date;
  created_by?: string;
  created_by_id?: string;
  updated_at?: Date;
  updated_by?: string;
  updated_by_id?: string;
  deleted_at?: Date;
  deleted_by?: string;
  deleted_by_id?: string;
}
const DefaultData = {
  created_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
  created_by: {
    type: String,
  },
  created_by_id: {
    type: String,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  updated_by: {
    type: String,
  },
  updated_by_id: {
    type: String,
  },
  deleted_at: {
    type: Date,
  },
  deleted_by: {
    type: String,
  },
  deleted_by_id: {
    type: String,
  },
};

export default DefaultData;
