'use client';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { Header } from '@/components/layout/header';
import { cn } from '@/lib/utils';

const UnauthenticatedRoutes = ['/login', '/signup'];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (UnauthenticatedRoutes.includes(pathname)) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar>
          <SidebarNav />
        </Sidebar>
        <SidebarInset className="flex flex-col flex-1">
          <Header />
          <main className={cn("flex-1 overflow-y-auto bg-background")}>
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
