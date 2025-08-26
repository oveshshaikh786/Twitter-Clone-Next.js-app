import '../styles/global.css';
import { SessionProvider } from 'next-auth/react';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { useRouter } from 'next/router';
import LoginBackground from '../components/LoginBackground';

TimeAgo.addDefaultLocale(en);

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const router = useRouter();
  return (
    <SessionProvider session={session}>
      {router.pathname === '/login' && <LoginBackground />}
      
      {/* keep page content above the fixed background */}
      
      <div style={{ position: 'relative', zIndex: 1 }}>
      <Component {...pageProps} />
      </div>
    
    </SessionProvider>
  );
}
