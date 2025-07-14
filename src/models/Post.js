import mongoose, { Schema, model, models } from 'mongoose';
//import User from './User';

const PostSchema = new Schema( {
    author: { type: mongoose.Types.ObjectId, ref: 'User' },
    text: String,
    likesCount: {type:Number, default:0},
    commentsCount: {type:Number, default:0},
    reposts: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    images: {type:[String]},
    parent: {type:mongoose.Types.ObjectId, ref: 'Post'}
  },
  {
    timestamps: true,
  }
);

const Post = models?.Post || model('Post', PostSchema);
export default Post;
