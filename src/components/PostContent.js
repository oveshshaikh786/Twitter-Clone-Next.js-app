import Link from 'next/link';
import Avatar from './Avatar';
import ReactTimeAgo from 'react-time-ago';
import PostButtons from '../components/PostButtons';

export default function PostContent({
  text,
  author,
  createdAt,
  _id,
  likesCount,
  likedByMe,
  commentsCount,
  repostsCount,
  sharesCount,
  onAction,
  images,
  big = false,
}) {

  function showImages() {
    if(!images?.length) {
      return '';
    }

    if (!images || images.length === 0) return null;

    return(
      <div className='flex -mx-1'>
        {images.length > 0 && images.map(img => (
          <div className='m-1' key={img}>
            <img src={img} alt='' />
          </div>  
        ))}
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex w-full">
        <div>
          {!!author?.image && (
            <Link href={'/' + author?.username}>
              <div className='cursor-pointer'>
                <Avatar src={author.image} /> 
              </div>
            </Link>
          )}
        </div>

        <div className="pl-2 grow">
          <div>
            <Link href={'/' + author?.username}>
              <span className="font-bold pr-1 cursor-pointer">{author.name}</span>
            </Link>
            {big && <br />}
            <Link href={'/' + author?.username}>
              <span className="text-twitterLightGrey cursor-pointer">@{author?.username}</span>
            </Link>
            {createdAt && !big && (
              <span className="pl-1 text-twitterLightGrey">
                <ReactTimeAgo date={createdAt} timeStyle={'twitter'} />
              </span>
            )}
          </div>
          {!big && (
            <div>
              <Link href={`/${author?.username}/status/${_id}`}>
                <div className='w-full cursor-pointer'>
                    {text}
                    {showImages()}
                </div>
              </Link>
              <PostButtons 
                username={author?.username}
                id={_id} 
                likesCount={likesCount} 
                likedByMe={likedByMe} 
                commentsCount={commentsCount}
                repostsCount={repostsCount}
                sharesCount={sharesCount}
                onAction={onAction}
              />
            </div>
          )}
        </div>
      </div>

      {big && (
        <div className="mt-2">
          <Link href={`/${author?.username}/status/${_id}`}>
              <div>
                {text}
                {showImages()}
              </div>
          </Link>
          {createdAt && (
            <div className="text-twitterLightGrey text-sm">
              {new Date(createdAt).toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}{' '}
              ·{' '}
              {new Date(createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: '2-digit',
                year: 'numeric',
              })}
            </div>
          )}
          <PostButtons 
            username={author?.username}
            id={_id} 
            likesCount={likesCount} 
            likedByMe={likedByMe} 
            commentsCount={commentsCount} 
            repostsCount={repostsCount}
            sharesCount={sharesCount}
            onAction={onAction}
          />
        </div>
      )}
    </div>
  );
}
