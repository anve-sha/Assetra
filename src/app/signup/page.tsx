'use client';

import Link from 'next/link';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import type { UserRole } from '@/lib/types';
import { ArrowLeft } from 'lucide-react';
import { AssetraLogo } from '@/components/logo';

function RoleSpecificForm({ role }: { role: UserRole }) {
  if (!role) return null;
  
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor={`${role}-full-name`}>Full name</Label>
        <Input id={`${role}-full-name`} placeholder="Rohan Sharma" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor={`${role}-email`}>Email</Label>
        <Input
          id={`${role}-email`}
          type="email"
          placeholder="m@example.com"
          required
        />
      </div>
      {role === 'Technician' && (
        <div className="grid gap-2">
          <Label htmlFor="team">Assigned Team</Label>
          <Select>
            <SelectTrigger id="team">
              <SelectValue placeholder="Select a team" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="team-a">Mechanical Team</SelectItem>
              <SelectItem value="team-b">Electrical Team</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="grid gap-2">
        <Label htmlFor={`${role}-password`}>Password</Label>
        <Input id={`${role}-password`} type="password" />
      </div>
      <Button asChild type="submit" className="w-full">
        <Link href="/dashboard">Create {role} account</Link>
      </Button>
    </div>
  );
}


export default function SignupPage() {
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md mx-auto p-4">
        <div className="flex justify-center mb-6">
          <AssetraLogo size="lg" />
        </div>
        <Card className="shadow-sm">
          <CardHeader className="space-y-1 text-center">
            {selectedRole ? (
                <div className='relative text-left'>
                    <Button variant="ghost" size="icon" className="absolute -left-4 -top-2" onClick={() => setSelectedRole(null)}>
                        <ArrowLeft className='h-4 w-4' />
                    </Button>
                    <CardTitle className="text-2xl text-center">Create {selectedRole} Account</CardTitle>
                    <CardDescription className='text-center'>Enter your information to get started.</CardDescription>
                </div>
            ) : (
                <>
                <CardTitle className="text-2xl">Create an account</CardTitle>
                <CardDescription>
                  First, select your role within the organization.
                </CardDescription>
                </>
            )}
            
          </CardHeader>
          <CardContent>
            {selectedRole ? (
                <RoleSpecificForm role={selectedRole} />
            ) : (
                <div className="grid gap-4">
                    <Button variant="outline" className='py-6 text-base' onClick={() => setSelectedRole('Manager')}>
                        Sign up as a Manager
                    </Button>
                    <Button variant="outline" className='py-6 text-base' onClick={() => setSelectedRole('Technician')}>
                        Sign up as a Technician
                    </Button>
                    <Button variant="outline" className='py-6 text-base' onClick={() => setSelectedRole('Employee')}>
                        Sign up as an Employee
                    </Button>
                </div>
            )}
            <div className="mt-4 text-center text-sm">
              Already have an account?{' '}
              <Link href="/login" className="underline">
                Log in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
