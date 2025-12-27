
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { AppShell } from '@/components/layout/app-shell';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ThemeSwitcher } from '@/components/theme/theme-switcher';

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="flex-1 space-y-4 pt-6 p-4 sm:p-6">
        <div className="flex items-center justify-between space-y-2 mb-4">
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                  Customize the look and feel of the application.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ThemeSwitcher />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Manage how you receive notifications from the system.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between space-x-2 p-4 rounded-lg border">
                  <Label htmlFor="new-task-email" className="flex flex-col space-y-1">
                    <span>New Task Assignment (Email)</span>
                    <span className="font-normal leading-snug text-muted-foreground">
                      Receive an email when a new maintenance task is assigned to you or your team.
                    </span>
                  </Label>
                  <Switch id="new-task-email" defaultChecked />
                </div>
                <div className="flex items-center justify-between space-x-2 p-4 rounded-lg border">
                  <Label htmlFor="overdue-push" className="flex flex-col space-y-1">
                    <span>Overdue Task Reminder (Push)</span>
                    <span className="font-normal leading-snug text-muted-foreground">
                      Get a push notification for tasks that are past their due date.
                    </span>
                  </Label>
                  <Switch id="overdue-push" defaultChecked />
                </div>
                <div className="flex items-center justify-between space-x-2 p-4 rounded-lg border">
                  <Label htmlFor="status-change-email" className="flex flex-col space-y-1">
                    <span>Status Change (Email)</span>
                    <span className="font-normal leading-snug text-muted-foreground">
                      Be notified when the status of a task you reported changes.
                    </span>
                  </Label>
                  <Switch id="status-change-email" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>
                Manage your account settings. These are for demonstration and are not functional.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="space-y-4">
                <h3 className="text-lg font-medium">Change Password</h3>
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                <Button>Update Password</Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                 <div className="flex items-center justify-between space-x-2 p-4 rounded-lg border">
                    <Label htmlFor="2fa-switch" className="flex flex-col space-y-1">
                      <span>Enable 2FA</span>
                      <span className="font-normal leading-snug text-muted-foreground">
                        Secure your account with an extra layer of protection.
                      </span>
                    </Label>
                    <Switch id="2fa-switch" />
                  </div>
              </div>
              
              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-destructive">Delete Account</h3>
                <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all associated data. This action is irreversible.
                </p>
                <Button variant="destructive">Delete My Account</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
