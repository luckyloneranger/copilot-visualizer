import React from 'react';
import { MessageSquare, Compass, LayoutGrid } from 'lucide-react';
import { SidebarNavItem } from './SidebarNavItem';

export const SidebarNav = ({ isHome }: { isHome: boolean }) => (
  <nav className="space-y-1 mb-4">
    <SidebarNavItem icon={<Compass size={20} />} label="Discover" active={isHome} />
    <SidebarNavItem icon={<MessageSquare size={20} />} label="Imagine" badge="New" />
    <SidebarNavItem icon={<LayoutGrid size={20} />} label="Library" />
    <SidebarNavItem icon={<LayoutGrid size={20} />} label="Labs" />
  </nav>
);
