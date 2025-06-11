import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type TimeSessionDocument = HydratedDocument<TimeSession>;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class TimeSession {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true })
  id_user: Types.ObjectId; // ← gunakan ObjectId, bukan class User

  @Prop({ required: true, type: Date })
  start_time: Date;

  @Prop({ required: true, type: Date })
  end_time: Date;

  @Prop({ type: String, default: '' })
  description: string;

  created_at: Date;
  updated_at: Date;
}

export const TimeSessionSchema = SchemaFactory.createForClass(TimeSession);

TimeSessionSchema.methods.getDuration = function () {
  if (!this.start_time || !this.end_time) return 0;
  return this.end_time.getTime() - this.start_time.getTime(); // durasi dalam ms
};
