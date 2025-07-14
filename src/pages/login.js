import { getProviders, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function LoginPage({providers}) {
  const {data, status} = useSession();
  const router = useRouter();
  if(status === 'loading') {
    return '';
  }
  
  if (data) {
    router.push('/');
  }
  
  return (
    <div className="flex items-center justify-center h-screen">
      {providers &&
      Object.values(providers).map(provider => (
        <div key={provider.name}>
            <button onClick={async () => {await signIn(provider.id)}} className="bg-twitterWhite pl-2 pr-5 px-6 py-2 text-black text-lg rounded-full flex items-center">
              <img src="/github_icon.png" alt="Github" className="h-8"/>
              <span>Sign in with {provider.name}</span>
            </button>
        </div>
      ))}
    </div>
  );
}

export async function getServerSideProps() {
  const providers = await getProviders();
  return {
      props: {providers},
  }
}