import React from 'react';

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    badge?: string;
    active?: boolean;
}

export const SidebarNavItem: React.FC<NavItemProps> = ({ icon, label, badge, active }) => {
    return (
        <a href="#" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${active ? 'bg-gray-200 text-black' : 'text-gray-700 hover:bg-gray-200'}`}>
            <span className="text-gray-600">{icon}</span>
            <span className="flex-1">{label}</span>
            {badge && <span className="text-[10px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded font-bold">{badge}</span>}
        </a>
    );
};
