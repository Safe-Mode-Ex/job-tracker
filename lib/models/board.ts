import mongoose, { Schema, Document } from "mongoose";

const BoardSchema = new Schema<IBoard>({
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
    index: true,
  },
  columns: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Column',
    },
  ],
}, {
  timestamps: true,
});

export interface IBoard extends Document {
  name: string;
  userId: string;
  columns: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export default mongoose.models.Board ||
  mongoose.model<IBoard>('Board', BoardSchema);
