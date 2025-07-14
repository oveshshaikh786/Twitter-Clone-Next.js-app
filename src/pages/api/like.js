import { initMongoose } from '../../libs/mongoose';
import Like from '../../models/Like';
import {authOptions} from './auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth';
import Post from '../../models/Post';
import User from '../../models/User';

  async function updateLikesCount(postId) {
    const post = await Post.findById(postId);
    
    post.likesCount = await Like.countDocuments({post:postId});
    await post.save();
}

export default async function handle(req, res) {
  await initMongoose();
  const session = await unstable_getServerSession(req, res, authOptions);

  const postId = req.body.id;
  const userId = session.user.id;
  
  const existingLike = await Like.findOne({author:userId, post:postId});
  
  if (existingLike) {
    await existingLike.deleteOne();
    
    await updateLikesCount(postId);
    
    res.json({Like:false});

  } else {
    
    const like = await Like.create({author:userId, post:postId});
    
    await updateLikesCount(postId);
    
    res.json({Like:true});
  }
}
