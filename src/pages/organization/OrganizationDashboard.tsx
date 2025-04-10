
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarRail, SidebarInset } from '@/components/ui/sidebar';
import OrganizationSidebar from '@/components/organization/OrganizationSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { dashboardService } from '@/services/dashboardService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const OrganizationDashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [organizationData, setOrganizationData] = useState<any>(null);

  const fetchOrganizationData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardService.getOrganization();
      setOrganizationData(data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch organization data:', err);
      setError('Failed to load organization data. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizationData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        <span className="ml-2 text-lg text-muted-foreground">Loading organization data...</span>
      </div>
    );
  }

  if (error || !organizationData) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 pb-4 px-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Organization Not Found</h2>
              <p className="text-muted-foreground mb-4">
                {error || "We couldn't find your organization data. This could be due to a connection issue."}
              </p>
              <Button 
                onClick={fetchOrganizationData}
                className="mt-2"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <OrganizationSidebar companyName={organizationData?.name || user?.company || 'Your Company'} />
        <SidebarRail />
        <SidebarInset className="p-6 bg-gray-50">
          <Outlet />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default OrganizationDashboard;
