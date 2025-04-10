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
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Filter, 
  Search,
  Eye
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

interface Interview {
  id: string;
  candidateName: string;
  position: string;
  interviewer: string;
  date: string;
  status: 'scheduled' | 'completed' | 'no_show' | 'rescheduled' | 'tech_issue' | 'on_hold';
  skills?: string[];
}

const OrganizationInterviews: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [selectedView, setSelectedView] = useState<string>("list");
  
  useEffect(() => {
    if (!user) return;
    
    fetchDashboardData();
    fetchInterviews();

    // Set up real-time subscription for interviews table updates
    const interviewsChannel = supabase
      .channel('public:interviews')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'interviews' }, 
        () => {
          fetchInterviews();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(interviewsChannel);
    };
  }, [user]);
  
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const data = await dashboardService.getOrganizationDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast.error('Failed to load organization data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInterviews = async () => {
    try {
      // In a real implementation, this would fetch from Supabase
      // For now, using mock data that matches the schema
      const mockInterviews: Interview[] = [
        {
          id: 'INT001',
          candidateName: 'Jane Doe',
          position: 'Senior Java Developer',
          interviewer: 'Alice Chen',
          date: '2025-04-10T10:00:00',
          status: 'scheduled',
          skills: ['Java', 'Spring Boot', 'Microservices']
        },
        {
          id: 'INT002',
          candidateName: 'John Smith',
          position: 'Frontend Developer',
          interviewer: 'Bob Wilson',
          date: '2025-04-08T14:30:00',
          status: 'completed',
          skills: ['React', 'TypeScript', 'Redux']
        },
        {
          id: 'INT003',
          candidateName: 'Mike Johnson',
          position: 'DevOps Engineer',
          interviewer: 'Carol Davis',
          date: '2025-04-15T11:00:00',
          status: 'scheduled',
          skills: ['Docker', 'Kubernetes', 'Jenkins']
        }
      ];
      
      setInterviews(mockInterviews);
    } catch (error) {
      console.error('Failed to load interviews:', error);
      toast.error('Failed to load interviews');
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'no_show':
        return 'bg-red-100 text-red-800';
      case 'rescheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'tech_issue':
        return 'bg-orange-100 text-orange-800';
      case 'on_hold':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ');
  };
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold">Interview Management</h1>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
          <Skeleton className="h-32" />
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Interview Management</h1>
          <p className="text-gray-500 mt-1">View and manage your organization's interviews</p>
        </div>
      </div>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Interviews</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.totalInterviews || 45}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Interviews</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.pendingInterviews || 12}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed Interviews</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.completedInterviews || 28}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.totalRequirements || 5}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-white rounded-md border p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div className="flex items-center gap-2 mb-4 sm:mb-0">
            <Filter className="h-5 w-5 text-gray-500" />
            <span className="font-medium">Filter Interviews</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full sm:w-auto">
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="no_show">No Show</SelectItem>
                <SelectItem value="rescheduled">Rescheduled</SelectItem>
              </SelectContent>
            </Select>
            
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Dates" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="this_week">This Week</SelectItem>
                <SelectItem value="this_month">This Month</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className={selectedView === "list" ? "bg-muted" : ""}
                onClick={() => setSelectedView("list")}
              >
                List
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={selectedView === "calendar" ? "bg-muted" : ""}
                onClick={() => setSelectedView("calendar")}
              >
                Calendar
              </Button>
            </div>
          </div>
        </div>
        
        <div className="relative overflow-x-auto rounded-md">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3">Interview ID</th>
                <th scope="col" className="px-6 py-3">Candidate</th>
                <th scope="col" className="px-6 py-3">Interviewer</th>
                <th scope="col" className="px-6 py-3">Date & Time</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Skills</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {interviews.map((interview) => (
                <tr key={interview.id} className="border-b bg-white hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{interview.id}</td>
                  <td className="px-6 py-4">{interview.candidateName}</td>
                  <td className="px-6 py-4">{interview.interviewer}</td>
                  <td className="px-6 py-4">
                    {format(new Date(interview.date), "MMM dd, yyyy • h:mm a")}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeStyle(interview.status)}`}>
                      {formatStatusText(interview.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {interview.skills?.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Button>
                  </td>
                </tr>
              ))}
              {interviews.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No interviews found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrganizationInterviews;
