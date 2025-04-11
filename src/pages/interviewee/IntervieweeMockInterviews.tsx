
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { Clock, Calendar as CalendarIcon, CreditCard, CheckCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

// Mock data for available skills
const availableSkills = [
  { id: 'skill1', name: 'JavaScript' },
  { id: 'skill2', name: 'Python' },
  { id: 'skill3', name: 'Java' },
  { id: 'skill4', name: 'React' },
  { id: 'skill5', name: 'Node.js' },
];

// Mock data for duration options
const durationOptions = [
  { id: 'dur1', value: '30', label: '30 mins' },
  { id: 'dur2', value: '60', label: '60 mins' },
  { id: 'dur3', value: '90', label: '90 mins' },
];

// Mock data for scheduled mock interviews
const mockScheduledMockInterviews = [
  { 
    id: 'M001', 
    skill: 'JavaScript', 
    date: '2025-04-09', 
    time: '14:00', 
    status: 'Scheduled' 
  },
];

// Mock time slots
const timeSlots = [
  "09:00 AM", "10:00 AM", "11:00 AM", 
  "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"
];

const IntervieweeMockInterviews: React.FC = () => {
  const [openScheduleDialog, setOpenScheduleDialog] = useState(false);
  const [openJoinDialog, setOpenJoinDialog] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedInterview, setSelectedInterview] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(5);
  const [selectedSkill, setSelectedSkill] = useState<string>('');
  const [selectedDuration, setSelectedDuration] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);
  const [scheduledInterviews, setScheduledInterviews] = useState(mockScheduledMockInterviews);

  const handleJoinClick = (interviewId: string) => {
    setSelectedInterview(interviewId);
    setOpenJoinDialog(true);
    setCountdown(5);
    
    // Mock countdown
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleScheduleClick = () => {
    setOpenScheduleDialog(true);
    setCurrentStep(1);
    setSelectedSkill('');
    setSelectedDuration('');
    setSelectedDate(undefined);
    setSelectedTimeSlot('');
    setPaymentDetails({
      cardNumber: '',
      expiryDate: '',
      cvv: ''
    });
    setIsPaymentProcessing(false);
    setIsPaymentSuccessful(false);
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePaymentSubmit = () => {
    // Validate payment form
    if (!paymentDetails.cardNumber || !paymentDetails.expiryDate || !paymentDetails.cvv) {
      alert('Please fill all payment details');
      return;
    }

    setIsPaymentProcessing(true);

    // Mock payment process
    setTimeout(() => {
      setIsPaymentProcessing(false);
      setIsPaymentSuccessful(true);
      
      // Add the new mock interview to the list
      if (selectedDate && selectedSkill && selectedTimeSlot) {
        const newInterview = {
          id: `M${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
          skill: availableSkills.find(skill => skill.id === selectedSkill)?.name || 'Unknown',
          date: format(selectedDate, 'yyyy-MM-dd'),
          time: selectedTimeSlot.split(' ')[0],
          status: 'Scheduled' as const
        };
        
        setScheduledInterviews(prev => [...prev, newInterview]);
        
        // Close dialog after 3 seconds of success message
        setTimeout(() => {
          setOpenScheduleDialog(false);
        }, 3000);
      }
    }, 2000);
  };

  const formatDateTime = (date: string, time: string) => {
    try {
      const dateTime = new Date(`${date}T${time}`);
      return format(dateTime, "MMM d, yyyy 'at' h:mm a");
    } catch (e) {
      return `${date} ${time}`;
    }
  };

  // Render the steps for the schedule dialog
  const renderScheduleStep = () => {
    switch (currentStep) {
      case 1: // Select Technology and Duration
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Technology/Skill</label>
              <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a skill" />
                </SelectTrigger>
                <SelectContent>
                  {availableSkills.map(skill => (
                    <SelectItem key={skill.id} value={skill.id}>
                      {skill.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Duration</label>
              <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  {durationOptions.map(option => (
                    <SelectItem key={option.id} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end">
              <Button 
                onClick={handleNextStep} 
                disabled={!selectedSkill || !selectedDuration}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Next: Select Timeslot
              </Button>
            </div>
          </div>
        );
        
      case 2: // Select Date and Time
        return (
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="space-y-2 flex-1">
                <label className="text-sm font-medium">Select Date</label>
                <div className="border rounded-md p-3">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => {
                      // Disable dates more than 7 days in the future or in the past
                      const now = new Date();
                      const oneWeekLater = new Date();
                      oneWeekLater.setDate(now.getDate() + 7);
                      return date < now || date > oneWeekLater;
                    }}
                    className="pointer-events-auto"
                  />
                </div>
              </div>
              
              <div className="space-y-2 flex-1">
                <label className="text-sm font-medium">Select Time Slot</label>
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map(slot => (
                    <Button
                      key={slot}
                      variant={selectedTimeSlot === slot ? "default" : "outline"}
                      className={selectedTimeSlot === slot ? "bg-purple-600 hover:bg-purple-700 text-white" : ""}
                      onClick={() => setSelectedTimeSlot(slot)}
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handlePrevStep}
              >
                Back
              </Button>
              <Button 
                onClick={handleNextStep} 
                disabled={!selectedDate || !selectedTimeSlot}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Next: Payment
              </Button>
            </div>
          </div>
        );
        
      case 3: // Payment
        return isPaymentSuccessful ? (
          <div className="flex flex-col items-center py-6 space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <h3 className="text-xl font-medium text-green-700">Payment Successful!</h3>
            <p className="text-center">
              Your mock interview has been scheduled for{' '}
              {selectedDate && selectedTimeSlot ? format(selectedDate, "MMM d, yyyy") + ' at ' + selectedTimeSlot : 'the selected time'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium">Payment Details</h3>
                <div className="flex items-center gap-1">
                  <CreditCard size={16} />
                  <span className="text-xs text-gray-500">Secure Payment</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Card Number</label>
                  <Input
                    placeholder="XXXX XXXX XXXX XXXX"
                    value={paymentDetails.cardNumber}
                    onChange={(e) => setPaymentDetails({...paymentDetails, cardNumber: e.target.value})}
                    maxLength={19}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Expiry Date</label>
                    <Input
                      placeholder="MM/YY"
                      value={paymentDetails.expiryDate}
                      onChange={(e) => setPaymentDetails({...paymentDetails, expiryDate: e.target.value})}
                      maxLength={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">CVV</label>
                    <Input
                      placeholder="XXX"
                      value={paymentDetails.cvv}
                      onChange={(e) => setPaymentDetails({...paymentDetails, cvv: e.target.value})}
                      maxLength={4}
                      type="password"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
                <div className="flex justify-between text-sm">
                  <span>Mock Interview ({selectedDuration} mins)</span>
                  <span>${parseInt(selectedDuration || '0') * 2}</span>
                </div>
                <div className="flex justify-between font-medium mt-2 pt-2 border-t">
                  <span>Total</span>
                  <span>${parseInt(selectedDuration || '0') * 2}</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handlePrevStep}
                disabled={isPaymentProcessing}
              >
                Back
              </Button>
              <Button 
                onClick={handlePaymentSubmit} 
                disabled={isPaymentProcessing || !paymentDetails.cardNumber || !paymentDetails.expiryDate || !paymentDetails.cvv}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isPaymentProcessing ? 'Processing...' : 'Pay Now'}
              </Button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mock Interviews</h1>
        <p className="text-muted-foreground">Schedule practice interviews to prepare for your real interviews.</p>
      </div>

      <Card className="border-purple-100 dark:border-purple-900/20">
        <CardContent className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Scheduled Mock Interviews</h2>
            <Button onClick={handleScheduleClick} className="bg-purple-600 hover:bg-purple-700 text-white">
              Schedule Mock Interview
            </Button>
          </div>
          
          {scheduledInterviews.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mock ID</TableHead>
                  <TableHead>Technology/Skill</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scheduledInterviews.map(interview => (
                  <TableRow key={interview.id}>
                    <TableCell className="font-medium">{interview.id}</TableCell>
                    <TableCell>{interview.skill}</TableCell>
                    <TableCell>{formatDateTime(interview.date, interview.time)}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline"
                        className="border-green-500 text-green-700"
                      >
                        {interview.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                        onClick={() => handleJoinClick(interview.id)}
                      >
                        Join Mock Interview
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CalendarIcon className="h-12 w-12 text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No Mock Interviews Scheduled</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                You haven't scheduled any mock interviews yet. Schedule one to practice your interviewing skills.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Schedule Mock Interview Dialog */}
      <Dialog open={openScheduleDialog} onOpenChange={setOpenScheduleDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Schedule Mock Interview</DialogTitle>
            <DialogDescription>
              Select the technology, preferred duration, and timeslot for your mock interview.
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center space-x-4">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${currentStep >= 1 ? 'border-purple-600 bg-purple-600 text-white' : 'border-gray-300'}`}>
                  1
                </div>
                <div className={`w-10 h-0.5 ${currentStep >= 2 ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${currentStep >= 2 ? 'border-purple-600 bg-purple-600 text-white' : 'border-gray-300'}`}>
                  2
                </div>
                <div className={`w-10 h-0.5 ${currentStep >= 3 ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${currentStep >= 3 ? 'border-purple-600 bg-purple-600 text-white' : 'border-gray-300'}`}>
                  3
                </div>
              </div>
            </div>
            
            {renderScheduleStep()}
          </div>
        </DialogContent>
      </Dialog>

      {/* Join Interview Dialog */}
      <Dialog open={openJoinDialog} onOpenChange={setOpenJoinDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Joining Mock Interview</DialogTitle>
            <DialogDescription>
              {countdown > 0 
                ? `Preparing your mock interview environment... ${countdown}`
                : "Your mock interview is ready!"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 space-y-4">
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2 flex items-center">
                <span>Coding Environment</span>
                <Badge className="ml-2 bg-purple-100 text-purple-800 border-purple-300">Mock Interview</Badge>
              </h3>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-4">
                <pre className="text-sm font-mono whitespace-pre-wrap">
{`// Write your code here
function solution(input) {
  // Implement your solution
  return input;
}

// Test your solution
console.log(solution("test"));`}
                </pre>
              </div>
              
              <div className="flex space-x-2 mt-2">
                <Button variant="outline" size="sm">Run Code</Button>
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">Submit Solution</Button>
              </div>
            </div>
            
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">Output</h3>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-4 h-24 overflow-y-auto">
                <pre className="text-sm font-mono text-gray-700 dark:text-gray-300">
                  {`> "test"`}
                </pre>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setOpenJoinDialog(false)}>End Session</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IntervieweeMockInterviews;
