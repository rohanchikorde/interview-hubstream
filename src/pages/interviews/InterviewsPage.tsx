
import React from 'react';
import InterviewsList from '@/components/interviews/InterviewsList';

const InterviewsPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Manage Interviews</h1>
      <InterviewsList />
    </div>
  );
};

export default InterviewsPage;
