
import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarRail, SidebarInset } from '@/components/ui/sidebar';
import OrganizationSidebar from '@/components/organization/OrganizationSidebar';
import { useAuth } from '@/contexts/AuthContext';

const OrganizationDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <OrganizationSidebar companyName={user?.company || 'Acme Corp'} />
        <SidebarRail />
        <SidebarInset className="p-6 bg-gray-50">
          <Outlet />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default OrganizationDashboard;
