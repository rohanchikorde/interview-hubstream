
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { getAllInterviewers, mockCompanies } from '@/data/mockData';
import { ChevronRight, Edit, Trash2, Plus } from 'lucide-react';

const InterviewerManagementPage: React.FC = () => {
  const allInterviewers = getAllInterviewers();
  
  // Helper function to get company name by ID
  const getCompanyName = (companyId: string) => {
    const company = mockCompanies.find(c => c.id === companyId);
    return company ? company.name : 'Unknown Company';
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Interviewer Management</h1>
        <Link to="/dashboard/admin/interviewers/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Interviewer
          </Button>
        </Link>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Interviewers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Total Interviews</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allInterviewers.map((interviewer) => (
                <TableRow key={interviewer.id}>
                  <TableCell className="font-medium">{interviewer.name}</TableCell>
                  <TableCell>{interviewer.email}</TableCell>
                  <TableCell>{interviewer.role}</TableCell>
                  <TableCell>{getCompanyName(interviewer.companyId)}</TableCell>
                  <TableCell>{interviewer.totalInterviews || 0}</TableCell>
                  <TableCell className="text-right">
                    <Link to={`/dashboard/admin/interviewers/${interviewer.id}/dashboard`}>
                      <Button variant="ghost" size="sm" className="mr-2">
                        <ChevronRight className="h-4 w-4" />
                        View
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" className="mr-2">
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500">
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default InterviewerManagementPage;
