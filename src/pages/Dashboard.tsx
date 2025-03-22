import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Sidebar } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { Image } from '@/components/ui/image';
import { 
  Menu, 
  List, 
  LogOut, 
  Calendar, 
  Ticket
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar className="hidden lg:flex">
        <div className="flex flex-col h-full">
          <div className="flex-1 py-4">
            <h2 className="px-7 mb-2 text-lg font-semibold tracking-tight">
              Dashboard
            </h2>
            <nav className="space-y-1 px-4">
              <Link
                to="/dashboard/requirements"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 dark:text-gray-400 transition-all hover:text-gray-900 dark:hover:text-gray-50",
                  location.pathname.includes('/dashboard/requirements') &&
                    "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-50"
                )}
              >
                <List className="h-4 w-4" />
                Requirements
              </Link>
              <Link
                to="/dashboard/tickets"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 dark:text-gray-400 transition-all hover:text-gray-900 dark:hover:text-gray-50",
                  location.pathname.includes('/dashboard/tickets') &&
                    "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-50"
                )}
              >
                <Ticket className="h-4 w-4" />
                Tickets
              </Link>
              <Link
                to="/dashboard/interviews"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 dark:text-gray-400 transition-all hover:text-gray-900 dark:hover:text-gray-50",
                  location.pathname.includes('/dashboard/interviews') &&
                    "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-50"
                )}
              >
                <Calendar className="h-4 w-4" />
                Interviews
              </Link>
            </nav>
          </div>
          <div className="py-4 px-6">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </Sidebar>
      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 border-b shrink-0 bg-white dark:bg-gray-950 sm:px-6">
          <div className="flex items-center gap-4 lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col p-0">
                <nav className="grid gap-2 px-2 py-4">
                  <Link
                    to="/dashboard/requirements"
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 dark:text-gray-400 transition-all hover:text-gray-900 dark:hover:text-gray-50",
                      location.pathname.includes('/dashboard/requirements') &&
                        "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-50"
                    )}
                  >
                    <List className="h-4 w-4" />
                    Requirements
                  </Link>
                  <Link
                    to="/dashboard/tickets"
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 dark:text-gray-400 transition-all hover:text-gray-900 dark:hover:text-gray-50",
                      location.pathname.includes('/dashboard/tickets') &&
                        "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-50"
                    )}
                  >
                    <Ticket className="h-4 w-4" />
                    Tickets
                  </Link>
                  <Link
                    to="/dashboard/interviews"
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 dark:text-gray-400 transition-all hover:text-gray-900 dark:hover:text-gray-50",
                      location.pathname.includes('/dashboard/interviews') &&
                        "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-50"
                    )}
                  >
                    <Calendar className="h-4 w-4" />
                    Interviews
                  </Link>
                  <Link
                    to="#"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 dark:text-gray-400 transition-all hover:text-gray-900 dark:hover:text-gray-50"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLogout();
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
            <Link to="/" className="flex items-center gap-2">
              <Image src="/assets/logo.png" alt="Logo" className="h-8 w-8" />
              <span className="font-bold">InterVue</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/dashboard/requirements"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location.pathname.includes('/dashboard/requirements')
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              Requirements
            </Link>
            <Link
              to="/dashboard/tickets"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location.pathname.includes('/dashboard/tickets')
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              Tickets
            </Link>
            <Link
              to="/dashboard/interviews"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location.pathname.includes('/dashboard/interviews')
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              Interviews
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
