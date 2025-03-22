
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { InterviewWithDetails, InterviewStatus, AddInterviewFeedbackRequest, InterviewFeedback } from '@/types/interview';
import { interviewService } from '@/services/interviewService';
import { format, isPast } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Star, MessageSquare, Calendar, User, Briefcase } from 'lucide-react';

const statusColors: Record<InterviewStatus, string> = {
  'Scheduled': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  'In Progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  'Completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  'Canceled': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
};

// Define feedback form schema
const feedbackFormSchema = z.object({
  rating: z.coerce.number().min(1, { message: 'Rating is required' }).max(5),
  comments: z.string().min(10, { message: 'Comments must be at least 10 characters' }),
  strengths: z.string().optional(),
  weaknesses: z.string().optional(),
  recommendation: z.string().optional(),
});

type FeedbackFormData = z.infer<typeof feedbackFormSchema>;

// Define status update form schema
const statusFormSchema = z.object({
  status: z.enum(['Scheduled', 'In Progress', 'Completed', 'Canceled'], {
    required_error: 'Please select a status',
  }),
});

type StatusFormData = z.infer<typeof statusFormSchema>;

const InterviewDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [interview, setInterview] = useState<InterviewWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  const feedbackForm = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      rating: 0,
      comments: '',
      strengths: '',
      weaknesses: '',
      recommendation: '',
    },
  });

  const statusForm = useForm<StatusFormData>({
    resolver: zodResolver(statusFormSchema),
    defaultValues: {
      status: 'Scheduled' as InterviewStatus,
    },
  });

  useEffect(() => {
    if (id) {
      fetchInterviewData(id);
    }
  }, [id]);

  useEffect(() => {
    if (interview) {
      statusForm.setValue('status', interview.status);
      
      if (interview.feedback) {
        feedbackForm.setValue('rating', interview.feedback.rating);
        feedbackForm.setValue('comments', interview.feedback.comments);
        feedbackForm.setValue('strengths', interview.feedback.strengths?.join(', ') || '');
        feedbackForm.setValue('weaknesses', interview.feedback.weaknesses?.join(', ') || '');
        feedbackForm.setValue('recommendation', interview.feedback.recommendation || '');
      }
    }
  }, [interview]);

  const fetchInterviewData = async (interviewId: string) => {
    setLoading(true);
    try {
      const data = await interviewService.getInterviewById(interviewId);
      setInterview(data);
    } catch (error) {
      console.error('Error fetching interview data:', error);
      toast.error('Failed to load interview details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (data: StatusFormData) => {
    if (!id) return;
    
    setSubmitting(true);
    try {
      await interviewService.updateInterviewStatus(id, { status: data.status });
      
      // Refresh the interview data
      await fetchInterviewData(id);
      setStatusDialogOpen(false);
      toast.success('Interview status updated successfully');
    } catch (error) {
      console.error('Error updating interview status:', error);
      toast.error('Failed to update interview status');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFeedbackSubmit = async (data: FeedbackFormData) => {
    if (!id) return;
    
    setSubmitting(true);
    try {
      const feedback: InterviewFeedback = {
        rating: data.rating,
        comments: data.comments,
        strengths: data.strengths ? data.strengths.split(',').map(s => s.trim()) : undefined,
        weaknesses: data.weaknesses ? data.weaknesses.split(',').map(s => s.trim()) : undefined,
        recommendation: data.recommendation || undefined,
      };
      
      await interviewService.addInterviewFeedback(id, { feedback });
      
      // Refresh the interview data
      await fetchInterviewData(id);
      setFeedbackDialogOpen(false);
      toast.success('Interview feedback added successfully');
    } catch (error) {
      console.error('Error adding interview feedback:', error);
      toast.error('Failed to add interview feedback');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-intervue-600"></div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-semibold">Interview not found</h2>
        <p className="mt-2 text-gray-500">The requested interview does not exist or has been removed.</p>
        <Button 
          className="mt-4" 
          variant="outline"
          onClick={() => navigate('/dashboard/interviews')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Interviews
        </Button>
      </div>
    );
  }

  const interviewDate = new Date(interview.scheduled_at);
  const isPastInterview = isPast(interviewDate);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={() => navigate('/dashboard/interviews')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Interviews
        </Button>
        <Badge className={statusColors[interview.status]}>
          {interview.status}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Interview Details</CardTitle>
          <CardDescription>
            {interview.requirement_title}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-gray-500" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">Scheduled At</h3>
              <p className="mt-1">{format(interviewDate, 'PPP p')}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <User className="h-5 w-5 mr-2 text-gray-500" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">Candidate</h3>
              <p className="mt-1">{interview.candidate_name}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Briefcase className="h-5 w-5 mr-2 text-gray-500" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">Interviewer</h3>
              <p className="mt-1">{interview.interviewer_name}</p>
            </div>
          </div>
          
          {interview.feedback && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500">Feedback</h3>
                <div className="flex items-center">
                  <h4 className="text-sm text-gray-500 mr-2">Rating:</h4>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < interview.feedback!.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm text-gray-500">Comments:</h4>
                  <p className="mt-1 text-sm">{interview.feedback.comments}</p>
                </div>
                {interview.feedback.strengths && interview.feedback.strengths.length > 0 && (
                  <div>
                    <h4 className="text-sm text-gray-500">Strengths:</h4>
                    <ul className="mt-1 list-disc list-inside text-sm">
                      {interview.feedback.strengths.map((strength, index) => (
                        <li key={index}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {interview.feedback.weaknesses && interview.feedback.weaknesses.length > 0 && (
                  <div>
                    <h4 className="text-sm text-gray-500">Areas for Improvement:</h4>
                    <ul className="mt-1 list-disc list-inside text-sm">
                      {interview.feedback.weaknesses.map((weakness, index) => (
                        <li key={index}>{weakness}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {interview.feedback.recommendation && (
                  <div>
                    <h4 className="text-sm text-gray-500">Recommendation:</h4>
                    <p className="mt-1 text-sm">{interview.feedback.recommendation}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-2 border-t p-6">
          <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                Update Status
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Interview Status</DialogTitle>
                <DialogDescription>
                  Change the current status of this interview.
                </DialogDescription>
              </DialogHeader>
              <Form {...statusForm}>
                <form onSubmit={statusForm.handleSubmit(handleStatusUpdate)} className="space-y-4">
                  <FormField
                    control={statusForm.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Scheduled">Scheduled</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="Canceled">Canceled</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit" disabled={submitting}>
                      {submitting ? 'Updating...' : 'Update Status'}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          {!interview.feedback && isPastInterview && (
            <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Add Feedback
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Interview Feedback</DialogTitle>
                  <DialogDescription>
                    Provide feedback for this interview.
                  </DialogDescription>
                </DialogHeader>
                <Form {...feedbackForm}>
                  <form onSubmit={feedbackForm.handleSubmit(handleFeedbackSubmit)} className="space-y-4">
                    <FormField
                      control={feedbackForm.control}
                      name="rating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rating (1-5)</FormLabel>
                          <FormControl>
                            <Select 
                              onValueChange={(value) => field.onChange(parseInt(value))} 
                              defaultValue={field.value.toString()}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a rating" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">1 - Poor</SelectItem>
                                <SelectItem value="2">2 - Below Average</SelectItem>
                                <SelectItem value="3">3 - Average</SelectItem>
                                <SelectItem value="4">4 - Good</SelectItem>
                                <SelectItem value="5">5 - Excellent</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={feedbackForm.control}
                      name="comments"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Comments</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter your comments..."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={feedbackForm.control}
                      name="strengths"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Strengths (comma-separated)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Technical skills, Communication, Problem solving..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={feedbackForm.control}
                      name="weaknesses"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Areas for Improvement (comma-separated)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Technical knowledge, Time management..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={feedbackForm.control}
                      name="recommendation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recommendation</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Would you recommend hiring this candidate?"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <DialogFooter>
                      <Button type="submit" disabled={submitting}>
                        {submitting ? 'Submitting...' : 'Submit Feedback'}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default InterviewDetail;
