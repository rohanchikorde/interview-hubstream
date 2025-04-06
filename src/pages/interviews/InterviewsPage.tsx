
import React from 'react';
import { useNavigate } from 'react-router-dom';
import InterviewsList from '@/components/interviews/InterviewsList';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, Clock, Filter, Plus, Briefcase } from 'lucide-react';
import { toast } from 'sonner';

const InterviewsPage: React.FC = () => {
  const navigate = useNavigate();

  const handleAssignBySkill = () => {
    navigate('/dashboard/admin/skills');
    toast.info('Redirected to Skills Management to assign an interviewer by skill');
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Manage Interviews</h1>
          <p className="text-muted-foreground">Schedule and manage technical interviews</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={() => navigate('/dashboard/interviews/schedule')} className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
            <Plus className="h-4 w-4 mr-2" /> Schedule Interview
          </Button>
          <Button variant="outline" onClick={handleAssignBySkill}>
            <Briefcase className="h-4 w-4 mr-2" /> Assign by Skill
          </Button>
        </div>
      </div>
      
      <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <h2 className="text-lg font-medium flex items-center">
            <Filter className="h-5 w-5 mr-2 text-purple-600" /> Filter Interviews
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full sm:w-auto">
            <Select>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Calendar className="h-4 w-4 mr-2 text-purple-600" />
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Date Range</SelectLabel>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            
            <Select>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Clock className="h-4 w-4 mr-2 text-purple-600" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="canceled">Canceled</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            
            <Select>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Briefcase className="h-4 w-4 mr-2 text-purple-600" />
                <SelectValue placeholder="Skill" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Skill</SelectLabel>
                  <SelectItem value="all">All Skills</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="react">React</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="devops">DevOps</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <InterviewsList />
    </div>
  );
};

export default InterviewsPage;
