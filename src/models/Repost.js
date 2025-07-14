import mongoose, { Schema, model, models } from 'mongoose';

const RepostSchema = new Schema({
  originalPost: { type: mongoose.Types.ObjectId, ref: 'Post', required: true },
  author: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
}, {
  timestamps: true,
});

const Repost = models?.Repost || model('Repost', RepostSchema);
export default Repost;