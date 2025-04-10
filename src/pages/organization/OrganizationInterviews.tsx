
import React, { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { dashboardService, DashboardSummary } from '@/services/dashboardService';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import StatCard from '@/components/organization/StatCard';
import { Calendar, Clock, CheckCircle2 } from 'lucide-react';

const OrganizationInterviews: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(null);
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
      <div className="space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold">Organization Interviews</h1>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">Organization Interviews</h1>
      {user && (
        <p className="text-gray-500">Welcome back, {user.name}!</p>
      )}
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <StatCard
          title="Total Interviews"
          value={dashboardData?.totalInterviews || 0}
          icon={<Calendar className="h-5 w-5" />}
        />
        
        <StatCard
          title="Upcoming Interviews"
          value={dashboardData?.pendingInterviews || 0}
          icon={<Clock className="h-5 w-5" />}
          textClass="text-blue-600"
        />
        
        <StatCard
          title="Completed Interviews"
          value={dashboardData?.completedInterviews || 0}
          icon={<CheckCircle2 className="h-5 w-5" />}
          textClass="text-green-600"
        />
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
            {dashboardData && dashboardData.totalInterviews > 0 ? (
              <div className="space-y-4">
                {dashboardData.recentActivity.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(activity.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                        activity.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        activity.status === 'no_show' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
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
