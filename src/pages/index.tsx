import '../styles/global.css';
import UsernameForm from '../components/UsernameForm';
import useUserInfo from '../hooks/useUserInfo';
import PostForm from '../components/PostForm';
import PostContent from '../components/PostContent';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Home() {

  const {data: session} = useSession();
  const { userInfo, setUserInfo, status: userInfoStatus } = useUserInfo();
  const [posts, setPosts] = useState([]);
  const [idsLikedByMe, setIdsLikedByMe] = useState([]);
  const router = useRouter();

  function fetchHomePosts() {
      axios.get('/api/posts')
      .then((response) => {
        setPosts(response.data.posts);
        setIdsLikedByMe(response.data.idsLikedByMe);
    })
    .catch((error) => {
      if (error.response?.status === 401) {
        console.warn('Unauthorized: User is not logged in.');
        setPosts([]);
        setIdsLikedByMe([]);
      } else {
        console.error('Failed to fetch posts:', error);
      }
    });
  }

  async function logout() {
    setUserInfo(null);
    await signOut();
  }

  useEffect(() => {
    // if (userInfoStatus !== 'loading') {
      fetchHomePosts();
    //}
  }, []);

  if (userInfoStatus === 'loading') {
    return 'loading user info';
  }

  if (userInfo && !userInfo?.username) {
    return <UsernameForm />;
  }

  if(!userInfo) {
    router.push('/login');
    return 'no user info';
  }

  return (
    <Layout>
      <h1 className="text-lg font-bold p-4">Home</h1>
      <PostForm
        onPost={() => {
          fetchHomePosts();
        }}
      />
      <div className="">
        {posts.length > 0 && posts.map(post => (
              <div key={post._id} className="border-t border-twitterBorder p-5" >
                {post.parent && (
                  <div key={`parent-${post._id}`}>
                     <PostContent {...post.parent} />
                     <div className='relative h-8'>
                        <div className='border-l-2 border-twitterBorder h-10 absolute ml-6 -top-4'></div>
                        {/* <div className="absolute top-8 left-1/2 transform -translate-x-[-20px] w-0.5 bg-twitterBorder h-full"></div> */}
                     </div>
                  </div>
                )}
                <PostContent 
                  {...post} 
                  likedByMe={idsLikedByMe.includes(post._id)}
                  repostsCount={post.repostsCount} 
                  sharesCount={post.sharesCount}
                  onAction={fetchHomePosts}   
                />
              </div>
          ))}
      </div>
      {userInfo && (
        <div className='p-5 text-center border-t border-twitterBorder'>
          <button onClick={logout} className='bg-twitterWhite text-black px-5 py-2 rounded-full'>Logout</button>
        </div>
      )}
    </Layout>
  );
}