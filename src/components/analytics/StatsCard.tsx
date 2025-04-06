
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  bgClass?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon,
  bgClass = "bg-gradient-to-br from-purple-500 to-indigo-600"
}) => {
  return (
    <Card className="overflow-hidden">
      <div className={`p-4 text-white ${bgClass}`}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">{title}</h3>
          <div className="text-white/80">
            {icon}
          </div>
        </div>
        <p className="text-2xl font-bold mt-2">{value}</p>
      </div>
    </Card>
  );
};

export default StatsCard;
