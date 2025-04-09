import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ticketService } from '@/services/ticketService';
import { TicketWithDetails, TicketStatus } from '@/types/ticket';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft } from 'lucide-react';

const statusColors: Record<TicketStatus, string> = {
  'open': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  'in_progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  'resolved': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  'escalated': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  'Pending': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
  'Hold': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  'Approved': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
  'Rejected': 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300'
};

const TicketDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<TicketWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchTicket();
    }
  }, [id]);

  const fetchTicket = async () => {
    setLoading(true);
    try {
      const ticketData = await ticketService.getTicketById(id);
      setTicket(ticketData);
    } catch (error) {
      console.error('Error fetching ticket:', error);
      toast.error('Failed to load ticket details');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate('/dashboard/tickets');
  };

  const handleStatusChange = async (newStatus: TicketStatus) => {
    if (ticket?.status === newStatus) return;

    setUpdatingStatus(true);
    try {
      const success = await ticketService.updateTicketStatus(id as string, newStatus);
      if (success) {
        toast.success(`Ticket status updated to ${newStatus}`);
        fetchTicket();
      } else {
        toast.error('Failed to update ticket status');
      }
    } catch (error) {
      console.error('Error updating ticket status:', error);
      toast.error('An error occurred while updating ticket status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return <div className="text-center">Loading ticket details...</div>;
  }

  if (!ticket) {
    return <div className="text-center">Ticket not found</div>;
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Ticket Details</CardTitle>
        <Button variant="ghost" onClick={handleGoBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tickets
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div>
            <h2 className="text-lg font-semibold">Subject</h2>
            <p>{ticket.requirement_title}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Company</h2>
            <p>{ticket.company_name}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Status</h2>
            <div className="flex items-center space-x-2">
              <Badge className={statusColors[ticket.status]}>{ticket.status}</Badge>
              <Select onValueChange={(value) => handleStatusChange(value as TicketStatus)} defaultValue={ticket.status}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={ticket.status} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="escalated">Escalated</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Hold">Hold</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Created At</h2>
            <p>{new Date(ticket.created_at).toLocaleDateString()}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Updated At</h2>
            <p>{new Date(ticket.updated_at).toLocaleDateString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketDetail;
