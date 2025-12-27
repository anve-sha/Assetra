'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import { Button } from '../ui/button';
import { AssetraLogo } from '../logo';
import { Badge } from '../ui/badge';

const notifications = [
    {
        title: 'New Maintenance Request',
        description: 'Pump X-1000 requires immediate attention.',
        time: '2m ago',
        read: false,
    },
    {
        title: 'Task Completed',
        description: 'Anil Singh has repaired the Conveyor Belt Z-200.',
        time: '1h ago',
        read: false,
    },
    {
        title: 'SLA Breach Warning',
        description: 'Task #RQ-1019 is approaching its SLA deadline.',
        time: '4h ago',
        read: true,
    }
];

export function Header() {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-card px-4 sm:px-6" data-sidebar="header">
      <SidebarTrigger className="md:hidden text-foreground hover:text-foreground/80" />
      <div className="flex items-center gap-2">
        <AssetraLogo />
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-4">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                         <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 justify-center p-0 text-xs">
                            {unreadCount}
                         </Badge>
                    )}
                    <span className="sr-only">Notifications</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className='flex flex-col'>
                {notifications.map((notification, index) => (
                  <div key={index}>
                    <DropdownMenuItem className="flex items-start gap-3 whitespace-normal">
                      {!notification.read && <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />}
                      <div className="grid gap-0.5">
                        <p className="font-semibold">{notification.title}</p>
                        <p className="text-muted-foreground">{notification.description}</p>
                        <p className="text-xs text-muted-foreground">{notification.time}</p>
                      </div>
                    </DropdownMenuItem>
                    {index < notifications.length - 1 && <DropdownMenuSeparator className='my-0' />}
                  </div>
                ))}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className='flex items-center gap-3 cursor-pointer'>
                <Avatar className="h-9 w-9">
                <AvatarImage
                    src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                    alt="User Avatar"
                />
                <AvatarFallback>AS</AvatarFallback>
                </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Aditya Sharma</p>
                <p className="text-xs leading-none text-muted-foreground">
                  aditya.sharma@example.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/login">Log out</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
