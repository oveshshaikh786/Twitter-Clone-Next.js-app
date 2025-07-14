import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import PostContent from '../../../components/PostContent';
import Layout from '../../../components/Layout';
import Link from 'next/link';
import useUserInfo from '../../../hooks/useUserInfo';
import PostForm from '../../../components/PostForm';
import TopNavLink from '../../../components/TopNavLink';

export default function PostPage() {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState();
  const [replies, setReplies] = useState([]);
  const [repliesLikedByMe, setRepliesLikedByMe] = useState([]);
  const {userInfo} = useUserInfo();

  function fetchData() {
      axios.get('/api/posts?id=' + id)
      .then((response) => {
      setPost(response.data.post);
    });

    axios.get('/api/posts?parent=' + id)
      .then(response => {
        setReplies(response.data.posts);
        setRepliesLikedByMe(response.data.idsLikedByMe);
      })
  }

  useEffect(() => {
    if (!id) {
      return;
    }
    fetchData();
  }, [id]);

  return (
    // prettier-ignore
    <Layout>
      {!!post?._id && (
        <div className='px-5 py-2'>
          <TopNavLink />
          {post.parent && (
            <div className="relative flex pb-2">
              <div className="w-0.5 flex flex-col items-center relative">

              {/* Connector line aligned exactly to avatar center */}
              <div className="absolute top-8 left-1/2 transform -translate-x-[-20px] w-0.5 bg-twitterBorder h-full"></div>
            </div>

              {/* Parent post content */}
              <div className="flex-1 pb-2">
                <PostContent {...post.parent} />
              </div>
            </div>
          )}

          <div>
             {<PostContent {...post} big />}
          </div>
        </div>
      )}
      {!!userInfo && (
        <div className='border-t border-twitterBorder py-5'>
          <PostForm onPost={fetchData} 
            parent={id}
            compact placeholder={"Tweet your reply"} />
        </div>
      )}
      <div className=''>
        {replies.length > 0 && replies.map(reply => (
          <div className='p-5 border-t border-twitterBorder' key={reply._id}>
              <PostContent {...reply} likedByMe={repliesLikedByMe.includes(
                reply._id
              )} />
          </div>
        ))}
      </div>
    </Layout>
  );
}
