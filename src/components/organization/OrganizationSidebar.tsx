
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  Calendar,
  BarChart2,
  Briefcase,
  Bell,
  HelpCircle,
  LogOut,
  Settings
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface OrganizationSidebarProps {
  companyName?: string;
}

const OrganizationSidebar: React.FC<OrganizationSidebarProps> = ({ companyName = "Acme Corp" }) => {
  const location = useLocation();
  const { logout } = useAuth();
  
  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully!');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out');
    }
  };

  const navigationItems = [
    { 
      path: '/organization/interviews', 
      name: 'Interviews', 
      icon: <Calendar className="h-4 w-4" /> 
    },
    { 
      path: '/organization/interviewers', 
      name: 'Interviewers', 
      icon: <Users className="h-4 w-4" /> 
    },
    { 
      path: '/organization/analytics', 
      name: 'Analytics', 
      icon: <BarChart2 className="h-4 w-4" /> 
    },
    { 
      path: '/organization/positions', 
      name: 'Positions', 
      icon: <Briefcase className="h-4 w-4" /> 
    },
    { 
      path: '/organization/notifications', 
      name: 'Notifications', 
      icon: <Bell className="h-4 w-4" />,
      badge: 3
    },
    { 
      path: '/organization/support', 
      name: 'Contact Support', 
      icon: <HelpCircle className="h-4 w-4" /> 
    }
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-purple-100 text-purple-900">
            {companyName.substring(0, 2)}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{companyName}</span>
            <span className="text-xs text-muted-foreground">Client Portal</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-2 text-xs font-medium">Client Portal</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-4 py-2">
              <p className="text-xs text-gray-500">View-only access. Contact your admin for changes.</p>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.path}
                    tooltip={item.name}
                  >
                    <NavLink to={item.path} className="flex items-center">
                      {item.icon}
                      <span className="ml-2">{item.name}</span>
                      {item.badge && (
                        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Switch to Admin">
                  <NavLink to="/dashboard" className="flex items-center">
                    <Settings className="h-4 w-4" />
                    <span className="ml-2">Switch to Admin</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="px-4 py-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default OrganizationSidebar;
