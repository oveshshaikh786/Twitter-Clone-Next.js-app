import mongoose, { Schema, model, models } from 'mongoose';

const ShareSchema = new Schema({
  post: { type: mongoose.Types.ObjectId, ref: 'Post', required: true },
  author: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
}, {
  timestamps: true,
});

const Share = models?.Share || model('Share', ShareSchema);
export default Share;