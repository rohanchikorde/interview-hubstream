
import React from 'react';
import { Users, Calendar, Briefcase, ChartBar, Clock, Shield } from 'lucide-react';

const features = [
  {
    icon: <Users className="w-8 h-8 text-intervue-600 dark:text-intervue-400" />,
    title: 'Candidate Management',
    description: 'Centralize candidate profiles, documents, and interview history in one organized system.'
  },
  {
    icon: <Calendar className="w-8 h-8 text-intervue-600 dark:text-intervue-400" />,
    title: 'Interview Scheduling',
    description: 'Effortlessly coordinate interviews with automated scheduling, reminders, and calendar integration.'
  },
  {
    icon: <Briefcase className="w-8 h-8 text-intervue-600 dark:text-intervue-400" />,
    title: 'Expert Interviewer Network',
    description: 'Access our network of industry-specialized interviewers for technical and domain expertise.'
  },
  {
    icon: <ChartBar className="w-8 h-8 text-intervue-600 dark:text-intervue-400" />,
    title: 'Insights & Analytics',
    description: 'Make data-driven decisions with comprehensive reports and hiring process analytics.'
  },
  {
    icon: <Clock className="w-8 h-8 text-intervue-600 dark:text-intervue-400" />,
    title: 'Streamlined Workflow',
    description: 'Reduce time-to-hire with automated processes and customizable workflow templates.'
  },
  {
    icon: <Shield className="w-8 h-8 text-intervue-600 dark:text-intervue-400" />,
    title: 'Secure & Compliant',
    description: 'Enterprise-grade security with role-based permissions and data protection protocols.'
  }
];

const Features: React.FC = () => {
  return (
    <section className="py-20 md:py-28 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="h2 text-slate-900 dark:text-white mb-4">
            All-in-One Interview Management
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Everything you need to streamline your hiring process in one intuitive platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="mb-5">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
