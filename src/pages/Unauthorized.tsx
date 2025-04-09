
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, Home, LogOut, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { sessionService } from '@/services/sessionService';

const Unauthorized = () => {
  const { logout, user, getUserRole, getDashboardPath } = useAuth();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<UserRole | null>(getUserRole());
  const [correctPath, setCorrectPath] = useState<string | null>(null);

  useEffect(() => {
    const checkRole = async () => {
      const role = await sessionService.getUserRole();
      if (role) {
        setUserRole(role);
        
        // Determine the correct path for the user's role
        let path = '';
        switch (role) {
          case 'admin':
            path = '/dashboard';
            break;
          case 'organization':
            path = '/organization';
            break;
          case 'interviewer':
            path = '/interviewer';
            break;
          case 'interviewee':
            path = '/interviewee';
            break;
          default:
            path = '/login';
        }
        setCorrectPath(path);
      }
    };
    
    checkRole();
  }, []);

  const handleRedirectToCorrectDashboard = () => {
    if (correctPath) {
      navigate(correctPath);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-md w-full text-center">
        <div className="bg-red-100 dark:bg-red-900/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-10 h-10 text-red-600 dark:text-red-400" />
        </div>
        
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Access Denied</h1>
        
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          You don't have permission to access this page. 
          {userRole && <span> Your current role is <span className="font-semibold capitalize">{userRole}</span>, 
            which doesn't have access to this resource.</span>}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <Button asChild variant="outline">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Return to Home
            </Link>
          </Button>
          
          {correctPath && correctPath !== '/login' && (
            <Button onClick={handleRedirectToCorrectDashboard}>
              <ArrowRight className="mr-2 h-4 w-4" />
              Go to Your Dashboard
            </Button>
          )}
          
          <Button variant="ghost" onClick={() => logout()}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
        
        <div className="text-sm text-gray-500 dark:text-gray-400 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h3 className="font-medium mb-2 text-gray-700 dark:text-gray-300">Role Access Guide:</h3>
          <ul className="list-disc list-inside space-y-1 text-left">
            <li><span className="font-semibold">Admin:</span> Can access the Admin Dashboard</li>
            <li><span className="font-semibold">Organization:</span> Can access the Organization Dashboard</li>
            <li><span className="font-semibold">Interviewer:</span> Can access the Interviewer Dashboard</li>
            <li><span className="font-semibold">Interviewee:</span> Can access the Interviewee Dashboard</li>
          </ul>
        </div>
        
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-6">
          If you believe this is an error, please contact your administrator or support team.
        </p>
      </div>
    </div>
  );
};

export default Unauthorized;
