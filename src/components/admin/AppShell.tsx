'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CalendarDays,
  FileCheck2,
  LayoutDashboard,
  MapPin,
  Mountain,
  PanelLeft,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '../ui/button';

const navItems = [
  {
    href: '/dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
  },
  {
    href: '/tourist-places',
    icon: MapPin,
    label: 'Tourist Places',
  },
  {
    href: '/cultural-events',
    icon: CalendarDays,
    label: 'Cultural Events',
  },
  {
    href: '/submissions',
    icon: FileCheck2,
    label: 'Submissions',
  },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar
        collapsible="icon"
        className="border-r border-border/80 bg-sidebar text-sidebar-foreground"
      >
        <SidebarHeader className="p-4">
          <Link href="/dashboard" className="flex items-center gap-2">
              <Mountain className="text-primary h-6 w-6" />
              <h1 className="text-lg font-semibold tracking-tight text-primary">
                TourVista
              </h1>
          </Link>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  variant="default"
                  tooltip={{
                    children: item.label,
                    className: 'bg-sidebar text-sidebar-foreground border-sidebar-border',
                  }}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="bg-background">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:h-16 sm:px-6 md:hidden">
          <SidebarTrigger asChild>
             <Button size="icon" variant="outline" className="sm:hidden">
                <>
                  <PanelLeft className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </>
            </Button>
          </SidebarTrigger>
        </header>
        <div className="h-[calc(100vh-3.5rem)] md:h-screen overflow-hidden">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
