'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  HardHat,
  ClipboardList,
  Calendar,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';

const mainNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/equipment', label: 'Equipment', icon: HardHat },
  { href: '/requests', label: 'Requests', icon: ClipboardList, badge: 5 },
  { href: '/calendar', label: 'Scheduler', icon: Calendar },
];

const secondaryNavItems = [
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function SidebarNav() {
  const pathname = usePathname();

  const renderNavItems = (items: typeof mainNavItems) => {
     return items.map((item) => {
        const isActive =
          item.href === '/'
            ? pathname === item.href
            : pathname.startsWith(item.href);
        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={isActive}
              className={cn(
                  'justify-start text-muted-foreground hover:bg-accent',
                  isActive && 'bg-primary text-primary-foreground hover:bg-primary/90'
              )}
            >
              <Link href={item.href}>
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
                {item.badge && (
                  <Badge className="ml-auto bg-red-500 text-white hover:bg-red-500/90">{item.badge}</Badge>
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      });
  }

  return (
    <>
      <SidebarHeader>
        {/* Can be used for a logo or title if needed */}
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {renderNavItems(mainNavItems)}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
            {secondaryNavItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                    <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className={cn(
                            'justify-start text-muted-foreground hover:bg-accent',
                            isActive && 'bg-primary text-primary-foreground hover:bg-primary/90'
                        )}
                        >
                        <Link href={item.href}>
                            <item.icon className="h-5 w-5" />
                            <span>{item.label}</span>
                        </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                );
            })}
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
