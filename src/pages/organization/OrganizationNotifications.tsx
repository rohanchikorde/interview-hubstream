
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Briefcase, Bell, Check } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface Notification {
  id: string;
  type: 'interview' | 'position' | 'system';
  message: string;
  date: string;
  read: boolean;
}

const OrganizationNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'interviews' | 'positions' | 'system'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      
      // Mock data - in a real implementation, this would fetch from Supabase
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'interview',
          message: 'Interview scheduled with Jane Doe for Senior Java Developer position',
          date: '2025-04-05T10:00:00',
          read: false
        },
        {
          id: '2',
          type: 'interview',
          message: 'John Smith interview completed. Feedback available.',
          date: '2025-04-03T14:30:00',
          read: true
        },
        {
          id: '3',
          type: 'position',
          message: 'New position added: Frontend Engineer',
          date: '2025-03-20T09:15:00',
          read: true
        },
        {
          id: '4',
          type: 'system',
          message: 'System maintenance scheduled for April 15, 2025',
          date: '2025-04-01T11:00:00',
          read: false
        },
      ];
      
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // In a real implementation, this would update Supabase
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      toast.error('Failed to update notifications');
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      // In a real implementation, this would update Supabase
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to update notification');
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'interview':
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case 'position':
        return <Briefcase className="h-5 w-5 text-green-500" />;
      case 'system':
        return <Bell className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Notifications</h1>
          <p className="text-gray-500 mt-1">Stay updated with important alerts and information</p>
        </div>
        
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={handleMarkAllAsRead}
        >
          <Check className="h-4 w-4" />
          Mark All as Read
        </Button>
      </div>
      
      <div className="flex gap-2 items-center">
        <Bell className="h-5 w-5 text-gray-500" />
        <span className="font-medium">Filter:</span>
        
        <Tabs defaultValue="all" className="ml-2" value={filter} onValueChange={(value: any) => setFilter(value)}>
          <TabsList>
            <TabsTrigger value="all">
              All
            </TabsTrigger>
            <TabsTrigger value="unread">
              Unread
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="interviews">
              Interviews
            </TabsTrigger>
            <TabsTrigger value="positions">
              Positions
            </TabsTrigger>
            <TabsTrigger value="system">
              System
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="space-y-4">
        {loading ? (
          <Card>
            <CardContent className="py-6">
              <p className="text-center text-gray-500">Loading notifications...</p>
            </CardContent>
          </Card>
        ) : filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <Card 
              key={notification.id}
              className={notification.read ? "bg-white" : "bg-blue-50 border-blue-100"}
            >
              <CardContent className="py-4 flex items-start gap-4">
                <div className="mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs uppercase font-semibold text-gray-500">
                        {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                      </span>
                      <p className="mt-1">{notification.message}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        {format(new Date(notification.date), "MMM dd, yyyy")}
                      </span>
                      {!notification.read && (
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-6 w-6" 
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <Check className="h-4 w-4" />
                          <span className="sr-only">Mark as read</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-6">
              <p className="text-center text-gray-500">No notifications found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default OrganizationNotifications;
