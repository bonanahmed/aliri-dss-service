import mongoose, { Document, Schema } from "mongoose";
import { tokenTypes } from "../../../config/tokens";
import { IDefaultData } from "../../defaultData";

export interface IToken extends Document, IDefaultData {
  token: string;
  account_id: mongoose.Types.ObjectId;
  type: string;
  expires: Date;
  blacklisted: boolean;
}

const tokenSchema = new Schema<IToken>(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    account_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "account", // Update with the actual ref model name if needed
      required: true,
    },
    type: {
      type: String,
      enum: [
        tokenTypes.REFRESH,
        tokenTypes.RESET_PASSWORD,
        tokenTypes.VERIFY_EMAIL,
      ],
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Token = mongoose.model<IToken>("token", tokenSchema);

export default Token;
