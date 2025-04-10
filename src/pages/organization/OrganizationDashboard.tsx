
import React, { useState, useEffect } from 'react';
import { dashboardService, Organization } from '@/services/dashboardService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { addDays } from 'date-fns';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  TooltipProps,
} from 'recharts';
import { 
  Users, 
  Building2, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  PlusCircle,
  TrendingUp,
  Filter,
  Clock3,
  Star,
  LogOut,
  RefreshCw
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { organizationMockData } from '@/data/organizationMockData';
import { DateRange } from 'react-day-picker';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from '@/integrations/supabase/client';

const COLORS = ['#8884d8', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// Enhanced tooltip content for charts
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 shadow-sm rounded-md">
        <p className="font-medium text-gray-700">{`${label}: ${payload[0].value}`}</p>
        {payload[0].payload?.comparison && (
          <p className="text-xs text-gray-500">
            {payload[0].payload.comparison > 0 ? '+' : ''}{payload[0].payload.comparison}% vs. prev. month
          </p>
        )}
      </div>
    );
  }

  return null;
};

const OrganizationDashboard: React.FC = () => {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });
  const [filterCompany, setFilterCompany] = useState<string>("all");
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchOrganizationData();
    
    // Set up real-time subscription to companies table
    const companiesChannel = supabase
      .channel('public:companies')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'companies' }, 
        () => {
          fetchOrganizationData();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(companiesChannel);
    };
  }, [dateRange, filterCompany]);

  const fetchOrganizationData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch organization data from Supabase
      const org = await dashboardService.getOrganization();
      
      if (org) {
        // Update the organization name if we have user data
        if (user?.company) {
          org.name = user.company;
        }
        setOrganization(org);
      } else {
        toast.error("Couldn't retrieve organization data");
        setError("Couldn't retrieve organization data");
      }
    } catch (error) {
      console.error('Error fetching organization data:', error);
      setError("Failed to load organization data");
      toast.error('Failed to load organization data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshData = () => {
    toast.info('Refreshing dashboard data...');
    fetchOrganizationData();
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Navigation to login page is handled by the AuthContext
      toast.success('Logged out successfully!');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20 mb-2" />
                <Skeleton className="h-3 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-3 w-1/2" />
              </CardHeader>
              <CardContent className="h-80">
                <Skeleton className="h-full w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !organization) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Organization Not Found</h2>
        <p className="mb-6 text-gray-600">We couldn't find your organization data.</p>
        <Button onClick={fetchOrganizationData} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  
  // Enhanced monthly data with comparison to previous month
  const enhancedMonthlyData = organization.stats.monthlyData?.map((item, index, array) => {
    const prevMonth = index > 0 ? array[index-1].interviews : 0;
    const comparison = prevMonth ? Math.round((item.interviews - prevMonth) / prevMonth * 100) : 0;
    return {
      ...item,
      comparison
    };
  });

  return (
    
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">{organization.name} Dashboard</h1>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="w-full sm:w-auto">
            <DatePickerWithRange 
              date={dateRange} 
              setDate={setDateRange} 
              className="w-full sm:w-auto"
            />
          </div>
          <Button onClick={handleRefreshData} variant="outline" size="icon" className="w-10 h-10">
            <Filter className="h-4 w-4" />
          </Button>
          <Button onClick={() => navigate('/dashboard/requirements/new')}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Requirement
          </Button>
          
          {/* User menu with logout */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-2 px-3">
                {user?.name || 'Account'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/organization/profile')}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/organization/settings')}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-red-600" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="interviews">Interviews</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab('interviews')}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Interviews</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{organization.stats.totalInterviews || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {organization.stats.pendingInterviews || 0} pending
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab('interviews')}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Interviews</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{organization.stats.completedInterviews || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {organization.stats.totalInterviews ? 
                    Math.round((organization.stats.completedInterviews || 0) / organization.stats.totalInterviews * 100) : 0}% completion rate
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/dashboard/candidates')}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{organization.stats.totalCandidates || 0}</div>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>15% increase this month</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab('requirements')}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Requirements</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{organization.stats.totalRequirements || 0}</div>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <Clock3 className="h-3 w-3" />
                  <span>3 active this week</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Interview Status</CardTitle>
                <CardDescription>Distribution of interview statuses</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={organization.stats.statusDistribution || []}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {(organization.stats.statusDistribution || []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Monthly Interviews</CardTitle>
                <CardDescription>Number of interviews per month</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={enhancedMonthlyData || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="interviews" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Interview Performance</CardTitle>
                <CardDescription>Average ratings over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      { month: 'Jan', score: 4.2 },
                      { month: 'Feb', score: 4.5 },
                      { month: 'Mar', score: 4.3 },
                      { month: 'Apr', score: 4.7 },
                      { month: 'May', score: 4.8 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 5]} />
                      <Tooltip content={<CustomTooltip />} />
                      <Line type="monotone" dataKey="score" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm text-gray-600">Average rating: 4.5/5.0</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Interview Metrics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Average Interview Duration</span>
                    <span className="text-sm font-medium">47 minutes</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Time to Hire</span>
                    <span className="text-sm font-medium">12 days</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Candidate Satisfaction</span>
                    <span className="text-sm font-medium">92%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="interviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Interview Analytics</CardTitle>
              <CardDescription>Detailed interview statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                      <Star className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {organization.stats.averageScore ? organization.stats.averageScore.toFixed(1) : 'N/A'}
                      </div>
                      <p className="text-xs text-muted-foreground">Out of 10</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Pending Interviews</CardTitle>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{organization.stats.pendingInterviews || 0}</div>
                      <div className="flex items-center gap-1 text-xs text-amber-600">
                        <Clock3 className="h-3 w-3" />
                        <span>2 scheduled today</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Completed Interviews</CardTitle>
                      <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{organization.stats.completedInterviews || 0}</div>
                      <div className="flex items-center gap-1 text-xs text-green-600">
                        <TrendingUp className="h-3 w-3" />
                        <span>↑ 5 this week</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Interviews</CardTitle>
                    <CardDescription>Last 5 interview sessions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {organizationMockData.interviews.slice(0, 5).map((interview) => (
                        <div key={interview.id} className="flex items-center justify-between border-b pb-2">
                          <div>
                            <p className="font-medium">{interview.candidateName}</p>
                            <p className="text-sm text-gray-500">Interviewer: {interview.interviewer}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm">{new Date(interview.dateTime).toLocaleDateString()}</p>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              interview.status === 'Completed' ? 'bg-green-100 text-green-800' :
                              interview.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                              interview.status === 'Canceled' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {interview.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" onClick={() => navigate('/dashboard/interviews')} className="w-full mt-4">
                      View All Interviews
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="requirements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Requirements Overview</CardTitle>
              <CardDescription>Status of your job requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Requirements</CardTitle>
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{organization.stats.totalRequirements || 0}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Requirements</CardTitle>
                      <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {organization.stats.totalRequirements ? Math.round(organization.stats.totalRequirements * 0.7) : 0}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {organization.stats.totalRequirements ? 
                          Math.round(0.7 * 100) : 0}% of total
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Requirements</CardTitle>
                    <CardDescription>Last 5 job requirements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {organizationMockData.positions.slice(0, 5).map((position) => (
                        <div key={position.id} className="flex items-center justify-between border-b pb-2">
                          <div>
                            <p className="font-medium">{position.title}</p>
                            <p className="text-sm text-gray-500">{position.department}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm">{new Date(position.openedDate).toLocaleDateString()}</p>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              position.status === 'Open' ? 'bg-green-100 text-green-800' :
                              position.status === 'Filled' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {position.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2 mt-4">
                      <div className="flex justify-between gap-2">
                        <Button onClick={() => navigate('/dashboard/requirements/new')} className="flex-1">
                          <PlusCircle className="mr-2 h-4 w-4" />
                          New Requirement
                        </Button>
                        <Button variant="outline" onClick={() => navigate('/dashboard/requirements')} className="flex-1">
                          View All Requirements
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrganizationDashboard;
