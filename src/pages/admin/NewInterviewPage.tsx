
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ScheduleInterview from '@/components/interviews/ScheduleInterview';

const NewInterviewPage: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();
  
  return (
    <div className="space-y-6">
      <ScheduleInterview />
    </div>
  );
};

export default NewInterviewPage;
