import { useEffect, useState } from 'react';
import '../styles/global.css';
import useUserInfo from '../hooks/useUserInfo.js';
import { useRouter } from 'next/router';
import { update } from 'next-auth/react';

export default function UsernameForm() {
  const { userInfo, status, session } = useUserInfo();
  const [username, setUsername] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') {
      return;
    }

    if (userInfo && username === '') {
      const defaultUsername = userInfo?.email?.split('@')[0];
      setUsername(defaultUsername.replace(/[^a-z]+/gi, ''));
    }
  }, [userInfo, status]);

  // prettier-ignore
  async function handleFormSubmit(e) {
  e.preventDefault();
    const res = await fetch(`/api/users?id=${session.user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });
    
    if (res.ok) {
      await update(); // 🔄 Refresh session data
      router.reload(); // router.push('/'); or router.reload(); if needed
    } else {
    console.error('Failed to update username');
    }
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <form className="text-center w-80" onSubmit={handleFormSubmit}>
        <h1 className="text-2xl font-semibold mb-4">Pick a username</h1>
        <input
          type="text"
          className="mb-4 w-full px-4 py-2 rounded-full bg-twitterBorder text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-twitterBlue"
          placeholder={'username'}
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <button className="w-full bg-twitterBlue hover:bg-[#1a8cd8] text-white font-bold py-2 px-4 rounded-full">
          Continue
        </button>
      </form>
    </div>
  );
}
