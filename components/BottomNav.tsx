
import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface BottomNavProps {
  items: NavItem[];
  activeItem: string;
  onItemClick: (id: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ items, activeItem, onItemClick }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-lg border-t border-gray-700/60 shadow-lg z-50">
      <div className="max-w-md mx-auto flex justify-around items-center h-16">
        {items.map((item) => {
          const isActive = item.id === activeItem;
          return (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-300 ease-in-out focus:outline-none ${
                isActive ? 'text-red-400' : 'text-gray-400 hover:text-white'
              }`}
            >
              <item.icon className={`w-6 h-6 mb-1 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} />
              <span className={`text-xs font-medium tracking-wide ${isActive ? 'font-bold' : ''}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 w-12 h-1 bg-red-500 rounded-t-full transition-all duration-300"></div>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};