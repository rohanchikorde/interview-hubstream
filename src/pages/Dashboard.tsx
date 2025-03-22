
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  Bell,
  Search,
  ChevronDown,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  FileText,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 fixed inset-y-0 z-10 hidden md:flex flex-col">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-intervue-600 flex items-center justify-center text-white font-bold text-lg">
              I
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white">Intervue</span>
          </Link>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-3">
          <ul className="space-y-1">
            <li>
              <Link to="/dashboard" className="nav-link-active flex items-center space-x-3 px-4 py-2.5">
                <LayoutDashboard className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboard/requirements" className="nav-link flex items-center space-x-3 px-4 py-2.5">
                <FileText className="w-5 h-5" />
                <span>Requirements</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboard/interviews" className="nav-link flex items-center space-x-3 px-4 py-2.5">
                <Calendar className="w-5 h-5" />
                <span>Interviews</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboard/candidates" className="nav-link flex items-center space-x-3 px-4 py-2.5">
                <Users className="w-5 h-5" />
                <span>Candidates</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboard/reports" className="nav-link flex items-center space-x-3 px-4 py-2.5">
                <BarChart3 className="w-5 h-5" />
                <span>Reports</span>
              </Link>
            </li>
          </ul>
          
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
            <ul className="space-y-1">
              <li>
                <Link to="/dashboard/settings" className="nav-link flex items-center space-x-3 px-4 py-2.5">
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </Link>
              </li>
              <li>
                <button 
                  onClick={handleLogout}
                  className="w-full nav-link flex items-center space-x-3 px-4 py-2.5 text-left"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign out</span>
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        {/* Header */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-16 fixed right-0 left-0 md:left-64 z-10">
          <div className="h-full px-4 flex items-center justify-between">
            <div className="flex items-center">
              <button className="md:hidden mr-4 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="block w-64 pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-intervue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="relative text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="relative">
                <button className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-intervue-200 flex items-center justify-center text-intervue-700">
                    <span className="text-sm font-medium">{user?.name?.substring(0, 2) || 'U'}</span>
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden sm:block">{user?.name || 'User'}</span>
                  <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="pt-16 p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Dashboard</h1>
            <p className="text-slate-600 dark:text-slate-400">Welcome back, {user?.name || 'User'}</p>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { title: 'Total Interviews', value: '48', icon: Calendar, color: 'bg-blue-500' },
              { title: 'Completed', value: '32', icon: CheckCircle2, color: 'bg-green-500' },
              { title: 'Pending', value: '12', icon: Clock, color: 'bg-amber-500' },
              { title: 'Issues', value: '4', icon: AlertCircle, color: 'bg-red-500' }
            ].map((stat, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-xl shadow-soft p-6 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{stat.title}</p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
                  </div>
                  <div className={`${stat.color} w-10 h-10 rounded-lg flex items-center justify-center text-white`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Requirements Quick Link */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-soft p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Interview Requirements</h2>
              <Link 
                to="/dashboard/requirements/new" 
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-intervue-100 text-intervue-700 hover:bg-intervue-200"
              >
                <Plus className="w-4 h-4" />
                <span>New Requirement</span>
              </Link>
            </div>
            
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Raise and manage interview requirements for your organization.
            </p>
            
            <Link
              to="/dashboard/requirements"
              className="inline-flex items-center text-intervue-600 font-medium hover:underline"
            >
              View all requirements
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          {/* Recent Interviews */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-soft p-6 mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Interviews</h2>
              <button className="btn-ghost flex items-center space-x-1 py-1.5 px-3">
                <Plus className="w-4 h-4" />
                <span>New</span>
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400">Candidate</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400">Position</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400">Interviewer</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { candidate: 'Alex Johnson', position: 'Frontend Developer', date: 'Today, 2:00 PM', interviewer: 'Sarah Miller', status: 'Scheduled' },
                    { candidate: 'Maria Garcia', position: 'UX Designer', date: 'Yesterday, 11:30 AM', interviewer: 'David Chen', status: 'Completed' },
                    { candidate: 'Robert Smith', position: 'Backend Engineer', date: 'Apr 28, 4:15 PM', interviewer: 'James Wilson', status: 'Completed' },
                    { candidate: 'Jennifer Lee', position: 'Product Manager', date: 'Apr 26, 10:00 AM', interviewer: 'Emma Davis', status: 'Cancelled' }
                  ].map((interview, index) => (
                    <tr key={index} className="border-b border-slate-200 dark:border-slate-700 last:border-0">
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-900 dark:text-white">{interview.candidate}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{interview.position}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{interview.date}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{interview.interviewer}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          interview.status === 'Scheduled' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300' :
                          interview.status === 'Completed' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' :
                          'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300'
                        }`}>
                          {interview.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Upcoming Interviews and Recent Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-soft p-6 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Upcoming Interviews</h2>
              
              <div className="space-y-4">
                {[
                  { candidate: 'Michael Brown', position: 'DevOps Engineer', date: 'Tomorrow, 11:00 AM', time: '45 min' },
                  { candidate: 'Laura Chen', position: 'Technical Writer', date: 'May 2, 3:30 PM', time: '60 min' },
                  { candidate: 'Kevin Wilson', position: 'Mobile Developer', date: 'May 3, 10:15 AM', time: '45 min' }
                ].map((interview, index) => (
                  <div key={index} className="flex items-center p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-intervue-100 dark:bg-intervue-900/30 flex items-center justify-center text-intervue-600 dark:text-intervue-400 mr-4">
                      <span className="font-medium text-sm">{interview.candidate.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-white">{interview.candidate}</h3>
                      <div className="flex space-x-4 text-sm text-slate-500 dark:text-slate-400">
                        <span>{interview.position}</span>
                        <span>•</span>
                        <span>{interview.date}</span>
                        <span>•</span>
                        <span>{interview.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Link to="/dashboard/interviews" className="block text-intervue-600 dark:text-intervue-400 text-sm font-medium mt-6 hover:underline">
                View all interviews
              </Link>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-soft p-6 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Recent Activities</h2>
              
              <div className="space-y-4">
                {[
                  { message: "Maria Garcia's interview feedback submitted", time: '2 hours ago', icon: CheckCircle2, iconClass: 'text-green-500' },
                  { message: 'New interview request for Senior Developer role', time: '4 hours ago', icon: Bell, iconClass: 'text-blue-500' },
                  { message: 'Robert Smith was moved to shortlisted', time: 'Yesterday', icon: Users, iconClass: 'text-purple-500' },
                  { message: 'System update scheduled for May 3rd', time: 'Yesterday', icon: Settings, iconClass: 'text-orange-500' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 mt-1 ${activity.iconClass}`}>
                      <activity.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-slate-700 dark:text-slate-300">{activity.message}</p>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <Link to="/dashboard/activities" className="block text-intervue-600 dark:text-intervue-400 text-sm font-medium mt-6 hover:underline">
                View all activities
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
