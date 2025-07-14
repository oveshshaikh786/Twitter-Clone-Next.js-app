import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function useUserInfo() {
  const { data: session, status: sessionStatus } = useSession();
  const [userInfo, setUserInfo] = useState(null);
  const [status, setStatus] = useState('loading');

 useEffect(() => {
    async function getUserInfo() {
      if (sessionStatus === 'loading') {
          return;
        }

      try {
        if (!session?.user?.id) {
          setStatus('unauthenticated');
          return;
        }
        const res = await fetch(`/api/users?id=${session.user.id}`);
        const data = await res.json();
        setUserInfo(data.user);
        setStatus('authenticated');
      } catch (error) {
        setStatus('error');
      }
    }

    getUserInfo();
  }, [sessionStatus, session]);

  return { userInfo, status, session, setUserInfo };
}

