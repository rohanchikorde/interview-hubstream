
import React from 'react';
import { Users, Calendar, Briefcase, ChartBar, Clock, Shield, Award, Zap, Target } from 'lucide-react';

const features = [
  {
    icon: <Users className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />,
    title: 'Expert Interviewer Network',
    description: 'Access specialized interviewers with deep domain expertise for thorough technical evaluations.'
  },
  {
    icon: <Calendar className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />,
    title: 'Seamless Scheduling',
    description: 'Automated coordination with smart calendar integration and instant availability matching.'
  },
  {
    icon: <ChartBar className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />,
    title: 'Comprehensive Analytics',
    description: 'Visualize hiring metrics and make informed decisions with detailed performance insights.'
  },
  {
    icon: <Clock className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />,
    title: 'Accelerated Hiring',
    description: 'Reduce time-to-hire by up to 40% with optimized workflows and parallel assessments.'
  },
  {
    icon: <Target className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />,
    title: 'Skill-Based Matching',
    description: 'Precisely map candidate skills to role requirements with our intelligent matching system.'
  },
  {
    icon: <Shield className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />,
    title: 'Enterprise Security',
    description: 'Bank-level data protection with role-based access controls and encryption at rest.'
  }
];

const Features: React.FC = () => {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-medium mb-2 block">Powerful Capabilities</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need For Exceptional Hiring
          </h2>
          <p className="text-xl text-foreground/80">
            A comprehensive platform designed to transform your technical interview process from end to end.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-purple transition-all duration-300 animate-fade-in opacity-0"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-5 bg-secondary p-3 rounded-lg inline-block">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-foreground/80">
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
