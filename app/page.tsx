"use client"; 

import { Suspense } from 'react';
import LoginContainer from '@/components/Logincontainer'; 


export default function Page() {
  return (
    
    <Suspense fallback={
      <div className="flex h-screen w-full items-center justify-center">
        <p className="text-lg text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    }>
      <LoginContainer />
    </Suspense>
  );
}
