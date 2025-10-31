
import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface SectionProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({ title, icon: Icon, children }) => {
  return (
    <section className="mb-8">
      <div className="flex items-center mb-4">
        <Icon className="w-6 h-6 mr-3 text-red-500" />
        <h2 className="text-2xl font-bold tracking-tight font-cinzel">{title}</h2>
      </div>
      <div className="pl-9">{children}</div>
    </section>
  );
};