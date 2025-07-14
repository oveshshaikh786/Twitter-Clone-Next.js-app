import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import { initMongoose } from '../../libs/mongoose';
import Repost from '../../models/Repost';
import Post from '../../models/Post';

export default async function handler(req, res) {
  await initMongoose();

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: 'Post ID is required' });
  }

  const post = await Post.findById(id);
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  const repost = await Repost.create({
    originalPost: id,
    author: session.user.id,
  });

  post.reposts += 1;
  await post.save();

  const repostsCount = await Repost.countDocuments({ originalPost: id });

  return res.status(200).json({ repost, reposts: repostsCount });
}
