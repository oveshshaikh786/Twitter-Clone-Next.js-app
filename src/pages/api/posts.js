import { initMongoose } from '../../libs/mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

import Post from '../../models/Post';
import User from '../../models/User';
import Like from '../../models/Like';
import Follower from '../../models/Follower';
import Share from '../../models/Share'; 
import Repost from '../../models/Repost';

export default async function handler(req, res) {
  await initMongoose();
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' }); // prevent crash
  }

  if (req.method === 'GET') {
    const { id } = req.query;
    if (id) {
      const post = await Post.findById(id)
        .populate('author')
        .populate({
          path: 'parent',
          populate: "author",
        });
      post.commentsCount = await Post.countDocuments({ parent: post._id });
      res.json({ post });
    } else {
      const parent = req.query.parent || null;
      const author = req.query.author;
      let searchFilter;
      if (!author && !parent) {
        const myFollows = await Follower.find({source: session.user.id}).exec();  
        const idsOfPeopleIFollow = myFollows.map(f => f.destination);
        searchFilter = {author: [...idsOfPeopleIFollow, session.user.id]};
      }
      if (author) {
        searchFilter = {author};
      }
      if (parent) {
        searchFilter = {parent};
      }
      const posts = await Post.find(searchFilter)
        .populate('author')
        .populate({
          path: 'parent',
          populate: 'author',
        })
        .sort({ createdAt: -1 })
        .limit(20)
        .lean();
        //const likesCount = Like.countDocuments({post :});

        const postsLikedByMe = await Like.find({
          author: session.user.id,
          post: posts.map((p) => p._id),
        });

        const idsLikedByMe = postsLikedByMe.map((like) => like.post);

    const enrichedPosts = await Promise.all(
      posts.map(async (post) => {
        const repostsCount = await Repost.countDocuments({ originalPost: post._id });
        const sharesCount = await Share.countDocuments({ post: post._id });
        const commentsCount = await Post.countDocuments({ parent: post._id });

        return {
          ...post,
          repostsCount,
          sharesCount,
          commentsCount,
        };
      })
    );

      res.json({
        posts: enrichedPosts,
        idsLikedByMe,
      });
    }
  }

  if (req.method === 'POST') {
    const { text, parent, images } = req.body;
    const post = await Post.create({
      author: session.user.id,
      text,
      parent,
      images,
    });
    if (parent) {
      const parentPost = await Post.findById(parent);
      parentPost.commentsCount = await Post.countDocuments({ parent: post._id });
      await parentPost.save();
    }
    res.json(post);
  }
}
