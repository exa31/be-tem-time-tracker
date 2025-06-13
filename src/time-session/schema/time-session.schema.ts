import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type TimeSessionDocument = HydratedDocument<TimeSession>;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class TimeSession {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true })
  id_user: Types.ObjectId; // ← gunakan ObjectId, bukan class User

  @Prop({ default: new Date(), type: Date })
  start_time: Date;

  @Prop({ type: Date })
  end_time: Date;

  @Prop({ type: String, default: '' })
  description: string;

  created_at: Date;
  updated_at: Date;
}

export const TimeSessionSchema = SchemaFactory.createForClass(TimeSession);

TimeSessionSchema.virtual('duration').get(function () {
  if (!this.start_time || !this.end_time) return '00:00:00';

  const diffMs = this.end_time.getTime() - this.start_time.getTime();
  const totalSeconds = Math.floor(diffMs / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
});

TimeSessionSchema.set('toJSON', { virtuals: true });
TimeSessionSchema.set('toObject', { virtuals: true });
