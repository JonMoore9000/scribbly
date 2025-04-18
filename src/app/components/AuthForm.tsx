// src/components/AuthForm.tsx
'use client';

import { useState } from 'react';
import { auth } from '../../lib/firebase';

import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = async () => {
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      alert((err as Error).message);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-4 border rounded">
      <h2 className="text-lg font-bold mb-2">{isLogin ? 'Login' : 'Sign Up'}</h2>
      <input
        className="w-full mb-2 p-2 border rounded"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="w-full mb-2 p-2 border rounded"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleAuth} className="w-full bg-indigo-600 text-white py-2 rounded">
        {isLogin ? 'Login' : 'Create Account'}
      </button>
      <button
        onClick={() => setIsLogin(!isLogin)}
        className="text-xs text-blue-500 mt-2 underline"
      >
        {isLogin ? 'Need an account? Sign up' : 'Already have an account? Log in'}
      </button>
    </div>
  );
}
