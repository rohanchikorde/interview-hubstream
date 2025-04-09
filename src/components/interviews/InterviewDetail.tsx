import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { InterviewWithDetails } from '@/types/interview';
import { interviewService } from '@/services/interviewService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// Define the schema for the feedback form
const feedbackSchema = z.object({
  rating: z.string().refine(val => {
    const num = Number(val);
    return !isNaN(num) && num >= 1 && num <= 5;
  }, {
    message: "Rating must be a number between 1 and 5.",
  }),
  comments: z.string().min(10, { message: "Comments must be at least 10 characters." }),
});

// Infer the type from the feedback schema
type FeedbackValues = z.infer<typeof feedbackSchema>;

const InterviewDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [interview, setInterview] = useState<InterviewWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  // Initialize the form
  const form = useForm<FeedbackValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      rating: '',
      comments: '',
    },
    mode: "onChange"
  });

  useEffect(() => {
    fetchInterviewDetails();
  }, [id]);

  const fetchInterviewDetails = async () => {
    if (!id) {
      toast.error('Interview ID is missing');
      return;
    }

    setLoading(true);
    try {
      const data = await interviewService.getInterviewById(id);
      setInterview(data);
    } catch (error) {
      console.error('Error fetching interview details:', error);
      toast.error('Failed to load interview details');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate('/dashboard/interviews');
  };

  // In the component where the addInterviewFeedback function is called:
  const handleSubmitFeedback = async (values: any) => {
    if (!interview) return;

    setSubmitting(true);
    
    try {
      const success = await interviewService.addInterviewFeedback(interview.id, {
        feedback: {
          rating: parseInt(values.rating),
          comments: values.comments
        }
      });

      if (success) {
        toast.success('Feedback submitted successfully');
        fetchInterviewDetails();
      } else {
        toast.error('Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('An error occurred while submitting feedback');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Interview Details</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-intervue-600"></div>
          </div>
        ) : interview ? (
          <div className="space-y-4">
            <div>
              <Label>Candidate Name</Label>
              <Input type="text" value={interview.candidate_name} readOnly />
            </div>
            <div>
              <Label>Requirement</Label>
              <Input type="text" value={interview.requirement_title} readOnly />
            </div>
            <div>
              <Label>Scheduled At</Label>
              <Input type="text" value={format(new Date(interview.scheduled_at), 'MMM d, yyyy h:mm a')} readOnly />
            </div>
            <div>
              <Label>Status</Label>
              <Input type="text" value={interview.status} readOnly />
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmitFeedback)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rating (1-5)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} placeholder="Rate the interview from 1 to 5" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="comments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comments</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Provide your feedback about the interview" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Feedback'}
                </Button>
              </form>
            </Form>

            <Button variant="secondary" onClick={handleGoBack}>
              Go Back
            </Button>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Interview not found
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InterviewDetail;
