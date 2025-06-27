import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAppDispatch, useAppSelector } from '@/State/Store';
import { login } from '@/State/Auth/AuthSlice';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();

  // Get loading and error from Redux store
  const { loading, error } = useAppSelector((state) => state.auth);

  const handleSignin = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <form
      onSubmit={handleSignin}
      className="flex flex-col gap-4 w-full px-8 max-w-md mx-auto mt-10"
    >
      <div>
        <Label htmlFor="email" className="text-white">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1"
          required
        />
      </div>

      <div>
        <Label htmlFor="password" className="text-white">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1"
          required
        />
      </div>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

      <Button
        type="submit"
        disabled={loading}
        className="mt-4 bg-white text-black hover:bg-gray-200 rounded px-4 py-2 transition-all duration-200"
      >
        {loading ? 'Signing In...' : 'Sign In'}
      </Button>
    </form>
  );
};

export default Signin;
