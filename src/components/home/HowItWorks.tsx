
import React, { useEffect } from 'react';
import { Check } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Define Interview Requirements',
    description: 'Specify job details, required skills, and interview structure for your hiring needs.',
    points: [
      'Customizable job templates',
      'Skill mapping tools',
      'Interview structure guides'
    ]
  },
  {
    number: '02',
    title: 'Match with Expert Interviewers',
    description: 'We match your requirements with industry experts who specialize in your desired skills.',
    points: [
      'Domain-specific interviewers',
      'Verified expertise and ratings',
      'Specialized technical assessments'
    ]
  },
  {
    number: '03',
    title: 'Conduct & Evaluate Interviews',
    description: 'Execute standardized interviews with real-time evaluation and comprehensive feedback.',
    points: [
      'Virtual interview rooms',
      'Structured evaluation forms',
      'Detailed candidate feedback'
    ]
  },
  {
    number: '04',
    title: 'Review Insights & Make Decisions',
    description: 'Analyze interview results, compare candidates, and make informed hiring decisions.',
    points: [
      'Comparative analytics',
      'Objective scoring metrics',
      'Team collaboration tools'
    ]
  }
];

const HowItWorks: React.FC = () => {
  // Animation on scroll functionality
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));

    return () => {
      animatedElements.forEach(el => observer.unobserve(el));
    };
  }, []);

  return (
    <section className="py-20 md:py-28 bg-slate-50 dark:bg-slate-800/50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="h2 text-slate-900 dark:text-white mb-4">
            How Intervue Works
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            A simplified end-to-end interview process designed to save you time and improve hiring quality.
          </p>
        </div>

        <div className="space-y-16 md:space-y-24">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8 md:gap-12 animate-on-scroll`}
            >
              {/* Step Number */}
              <div className="w-full md:w-1/3 lg:w-2/5">
                <div className="relative">
                  <div className="absolute -inset-4 md:-inset-6 bg-intervue-100/70 dark:bg-intervue-900/20 rounded-2xl blur-xl"></div>
                  <div className="relative glass-panel p-8 md:p-10 flex flex-col items-center md:items-start text-center md:text-left">
                    <span className="text-5xl md:text-7xl font-bold text-intervue-600/90 dark:text-intervue-400/90 mb-4">{step.number}</span>
                    <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">{step.title}</h3>
                    <p className="text-slate-600 dark:text-slate-300">{step.description}</p>
                  </div>
                </div>
              </div>

              {/* Step Features */}
              <div className="w-full md:w-2/3 lg:w-3/5">
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 md:p-8 shadow-soft">
                  <ul className="space-y-4">
                    {step.points.map((point, pointIndex) => (
                      <li key={pointIndex} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-intervue-100 dark:bg-intervue-900/50 rounded-full flex items-center justify-center mt-0.5">
                          <Check className="w-4 h-4 text-intervue-600 dark:text-intervue-400" />
                        </div>
                        <span className="text-slate-700 dark:text-slate-200">{point}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Example UI mockup */}
                  <div className="mt-8 p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                    <div className="h-[160px] bg-slate-200 dark:bg-slate-700 rounded flex items-center justify-center">
                      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">UI Preview for Step {step.number}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
