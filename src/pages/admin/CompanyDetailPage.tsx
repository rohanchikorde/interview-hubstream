
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardDescription 
} from '@/components/ui/card';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  mockCompanies, 
  mockInterviewers, 
  mockInterviewStats 
} from '@/data/mockData';
import { CalendarPlus, ChevronRight, Building, User, Phone, Mail, Calendar } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const CompanyDetailPage: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();
  
  // Find the company from mock data
  const company = mockCompanies.find(c => c.id === companyId);
  const interviewers = mockInterviewers[companyId || ''] || [];
  const stats = mockInterviewStats[companyId || ''] || { total: 0, upcoming: 0, completed: 0 };
  
  if (!company) {
    return <div className="p-4">Company not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{company.name}</h1>
          <p className="text-gray-500 dark:text-gray-400">{company.industry}</p>
        </div>
        <Link to={`/dashboard/admin/companies/${companyId}/interviews/new`}>
          <Button>
            <CalendarPlus className="mr-2 h-4 w-4" />
            Create New Interview
          </Button>
        </Link>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Company Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <Building className="mr-2 h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Address</p>
                  <p>{company.address}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <User className="mr-2 h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Contact Person</p>
                  <p>{company.contactPerson}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p>{company.email}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Phone className="mr-2 h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p>{company.phone}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Date Added</p>
                  <p>{company.dateAdded}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Interview Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-center">
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-gray-500">Total Interviews</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-md text-center">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.upcoming}</p>
                <p className="text-sm text-gray-500">Upcoming</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-md text-center">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completed}</p>
                <p className="text-sm text-gray-500">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Interviewers</CardTitle>
          <CardDescription>Interviewers associated with {company.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {interviewers.map((interviewer) => (
                <TableRow key={interviewer.id}>
                  <TableCell className="font-medium">{interviewer.name}</TableCell>
                  <TableCell>{interviewer.email}</TableCell>
                  <TableCell>{interviewer.role}</TableCell>
                  <TableCell className="text-right">
                    <Link to={`/dashboard/admin/interviewers/${interviewer.id}`}>
                      <Button variant="ghost" size="sm">
                        View Dashboard
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
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

export default CompanyDetailPage;
