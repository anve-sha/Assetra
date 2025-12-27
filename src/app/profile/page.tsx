
'use client';

import { useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { AppShell } from '@/components/layout/app-shell';

export default function ProfilePage() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState("https://i.pravatar.cc/150?u=a042581f4e29026704d");

  const handleSaveChanges = () => {
    toast({
      title: 'Changes Saved (Demo)',
      description: "In a real application, your profile would now be updated.",
    });
  };

  const handleChangePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newAvatarUrl = URL.createObjectURL(file);
      setAvatarUrl(newAvatarUrl);
      toast({
        title: 'Photo Updated (Demo)',
        description: 'Your new profile photo is now being displayed.',
      });
    }
  };

  return (
    <AppShell>
      <div className="flex-1 space-y-4 pt-6 p-4 sm:p-6">
        <h2 className="text-3xl font-bold tracking-tight mb-4">Profile</h2>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>
                Manage your account settings and profile information. This is a functional demo.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={avatarUrl} alt="User Avatar" />
                  <AvatarFallback>AS</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-lg font-semibold">Aditya Sharma</p>
                  <p className="text-muted-foreground">aditya.sharma@example.com</p>
                  <Button variant="outline" size="sm" onClick={handleChangePhotoClick}>Change Photo</Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="Aditya Sharma" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="aditya.sharma@example.com" />
              </div>
              <div className="flex justify-end">
                  <Button onClick={handleSaveChanges}>Save Changes</Button>
              </div>
              <p className="text-sm text-muted-foreground pt-4">
                Note: Profile management requires a backend. Changes made here are for demonstration only and will not be saved.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
