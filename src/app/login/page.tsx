'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { UserRole } from '@/lib/types';
import { AssetraLogo } from '@/components/logo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = () => {
    let role: UserRole = 'Employee'; // Default role
    let user = 'Employee';

    if (email.toLowerCase() === 'manager@assetra.com') {
      role = 'Manager';
      user = 'Manager';
    } else if (email.toLowerCase() === 'tech@assetra.com') {
      role = 'Technician';
      user = 'Technician';
    }

    toast({
      title: 'Login Successful',
      description: `Welcome! You are logged in as a ${user}.`,
    });
    router.push('/dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md mx-auto p-4">
        <div className="flex justify-center mb-6">
          <AssetraLogo size="lg" />
        </div>
        <Card className="shadow-sm">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>
              Login as a specific role with the emails below.
            </CardDescription>
             <div className="text-sm text-muted-foreground pt-2">
                <p>Manager: <span className="font-semibold">manager@assetra.com</span></p>
                <p>Technician: <span className="font-semibold">tech@assetra.com</span></p>
                <p>Employee: <span className="font-semibold">any other email</span></p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="#"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input id="password" type="password" required defaultValue="password123" />
              </div>
              <Button onClick={handleLogin} type="submit" className="w-full">
                Login
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
