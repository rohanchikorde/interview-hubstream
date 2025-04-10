
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { requirementService } from '@/services/requirementService';
import { Requirement } from '@/types/requirement';
import { Loader2, FileText, Calendar, Users, ArrowUpRight } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const OrganizationRequirements: React.FC = () => {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequirements = async () => {
      try {
        setLoading(true);
        const data = await requirementService.getRequirements();
        setRequirements(data);
      } catch (error) {
        console.error('Error fetching requirements:', error);
        toast.error('Failed to fetch requirements');
      } finally {
        setLoading(false);
      }
    };

    fetchRequirements();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'closed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'fulfilled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Requirements</h1>
          <p className="text-muted-foreground">View and manage your job requirements</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <span className="ml-2 text-purple-600">Loading requirements...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {requirements.length > 0 ? (
            requirements.map((requirement) => (
              <Card 
                key={requirement.id}
                className="overflow-hidden border-purple-100 hover:border-purple-300 transition-all duration-300"
              >
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h3 className="text-lg font-medium">{requirement.title}</h3>
                        <Badge className={getStatusColor(requirement.status)}>
                          {requirement.status.charAt(0).toUpperCase() + requirement.status.slice(1)}
                        </Badge>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => navigate(`/organization/requirements/${requirement.id}`)}
                      >
                        <ArrowUpRight className="h-4 w-4" />
                        <span className="sr-only">View details</span>
                      </Button>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 line-clamp-2">{requirement.description}</p>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span>
                          Posted: {new Date(requirement.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-gray-400 mr-2" />
                        <span>Positions: {requirement.number_of_positions}</span>
                      </div>
                      <div className="flex items-center flex-wrap">
                        <FileText className="h-4 w-4 text-gray-400 mr-2" />
                        <span>{requirement.skills?.length || 0} Skills</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex flex-wrap gap-1">
                      {requirement.skills?.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="outline" className="bg-gray-50">
                          {skill}
                        </Badge>
                      ))}
                      {requirement.skills && requirement.skills.length > 3 && (
                        <Badge variant="outline" className="bg-gray-50">
                          +{requirement.skills.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="border-dashed border-2 border-gray-300">
              <CardContent className="p-6 text-center">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No Requirements Yet</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mt-2">
                  There are currently no job requirements for your organization. Please contact your administrator to create new requirements.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default OrganizationRequirements;
