
import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface CardProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  overrideClassName?: string;
}

export const Card: React.FC<CardProps> = ({ title, subtitle, icon: Icon, children, onClick, className = '', overrideClassName }) => {
  const cardClasses = overrideClassName || `
    bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-lg p-4 
    transition-all duration-300 ease-in-out shadow-lg hover:shadow-red-500/40 
    hover:border-red-500/50 hover:-translate-y-1
    ${onClick ? 'cursor-pointer' : ''} ${className}
  `;

  return (
    <div className={cardClasses} onClick={onClick}>
      <div className="flex items-start">
        {Icon && <Icon className="w-8 h-8 mr-4 text-red-400 flex-shrink-0 mt-1" />}
        <div className="flex-grow">
          <h3 className="text-lg font-semibold text-white font-cinzel">{title}</h3>
          {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
        </div>
      </div>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
};