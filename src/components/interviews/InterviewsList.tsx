
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { InterviewWithDetails, InterviewStatus } from '@/types/interview';
import { interviewService } from '@/services/interviewService';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, Filter, Plus } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';

// Updated to use lowercase keys that match the InterviewStatus type
const statusColors: Record<InterviewStatus, string> = {
  'scheduled': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  'completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  'rescheduled': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  'tech_issue': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  'no_show': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  'on_hold': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
};

// Helper function to display friendly status names
const getDisplayStatus = (status: InterviewStatus): string => {
  const statusMap: Record<InterviewStatus, string> = {
    'scheduled': 'Scheduled',
    'completed': 'Completed',
    'rescheduled': 'Rescheduled',
    'tech_issue': 'Technical Issue',
    'no_show': 'No Show',
    'on_hold': 'On Hold'
  };
  return statusMap[status];
};

const InterviewsList: React.FC = () => {
  const [interviews, setInterviews] = useState<InterviewWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<InterviewStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const fetchInterviews = async () => {
    setLoading(true);
    try {
      const data = await interviewService.getInterviews();
      setInterviews(data);
    } catch (error) {
      console.error('Error fetching interviews:', error);
      toast.error('Failed to load interviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();

    // Subscribe to realtime updates
    const interviewsChannel = supabase
      .channel('public:interviews')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'interviews'
      }, () => {
        fetchInterviews();
        toast.info('Interview list updated');
      })
      .subscribe();

    return () => {
      supabase.removeChannel(interviewsChannel);
    };
  }, [statusFilter]);

  const filteredInterviews = interviews.filter(interview => {
    const matchesSearch = 
      (interview.candidate_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (interview.interviewer_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (interview.requirement_title?.toLowerCase() || '').includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || interview.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (id: string) => {
    navigate(`/dashboard/interviews/${id}`);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Interviews</CardTitle>
        <Button onClick={() => navigate('/dashboard/interviews/schedule')}>
          <Plus className="mr-2 h-4 w-4" />
          Schedule Interview
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search by candidate, interviewer, or requirement..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-48 flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select 
              value={statusFilter} 
              onValueChange={(value) => setStatusFilter(value as InterviewStatus | 'all')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="rescheduled">Rescheduled</SelectItem>
                <SelectItem value="tech_issue">Technical Issue</SelectItem>
                <SelectItem value="no_show">No Show</SelectItem>
                <SelectItem value="on_hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-intervue-600"></div>
          </div>
        ) : filteredInterviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchQuery ? 'No interviews match your search' : 'No interviews found'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Interviewer</TableHead>
                  <TableHead>Requirement</TableHead>
                  <TableHead>Scheduled At</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInterviews.map((interview) => (
                  <TableRow key={interview.id}>
                    <TableCell className="font-medium">{interview.candidate_name}</TableCell>
                    <TableCell>{interview.interviewer_name}</TableCell>
                    <TableCell>{interview.requirement_title}</TableCell>
                    <TableCell>
                      {format(new Date(interview.scheduled_at), 'MMM d, yyyy h:mm a')}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[interview.status]}>
                        {getDisplayStatus(interview.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails(interview.id)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InterviewsList;
