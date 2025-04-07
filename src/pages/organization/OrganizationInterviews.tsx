
import React, { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { dashboardService } from '@/services/dashboardService';
import { toast } from 'sonner';

const OrganizationInterviews: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    if (!user) return;
    
    const fetchDashboardData = async () => {
      try {
        const data = await dashboardService.getOrganizationDashboardData(user.id);
        setDashboardData(data);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        toast.error('Failed to load organization data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">Organization Dashboard</h1>
      {user && (
        <p className="text-gray-500">Welcome back, {user.name}!</p>
      )}
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Interviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboardData?.counts?.interviews || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Upcoming Interviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{dashboardData?.counts?.upcomingInterviews || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Completed Interviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{dashboardData?.counts?.completedInterviews || 0}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Interviews</CardTitle>
            <CardDescription>
              View and manage your organization's interviews
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardData?.counts?.interviews > 0 ? (
              <p>Your interview list will appear here</p>
            ) : (
              <p className="text-center py-6 text-gray-500">No interviews scheduled yet for your organization</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrganizationInterviews;
