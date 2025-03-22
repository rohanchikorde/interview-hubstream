
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';

const Hero: React.FC = () => {
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
    <section className="relative overflow-hidden pt-24 pb-20 md:pt-32 md:pb-28 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Background elements */}
      <div className="hero-glow"></div>
      <div className="absolute inset-0 grid-pattern-bg"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center px-3 py-1.5 mb-6 rounded-full bg-intervue-100 dark:bg-intervue-900/30 border border-intervue-200 dark:border-intervue-800/50 animate-fade-in">
            <span className="text-intervue-700 dark:text-intervue-400 text-sm font-medium">Just launched! Interview-as-a-Service</span>
          </div>
          
          <h1 className="h1 text-slate-900 dark:text-white mb-6 leading-tight animate-fade-in">
            Streamline Your Hiring Process with <span className="text-intervue-600 dark:text-intervue-400">Intervue</span>
          </h1>
          
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mb-10 animate-fade-in opacity-0" style={{ animationDelay: '0.1s' }}>
            A centralized platform for managing interview requirements, candidates, interviewers, and payments — all in one beautiful interface.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-12 animate-fade-in opacity-0" style={{ animationDelay: '0.2s' }}>
            <Link to="/register" className="w-full sm:w-auto btn-primary flex items-center justify-center space-x-2 px-8 py-3 text-base">
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/demo" className="w-full sm:w-auto btn-secondary flex items-center justify-center space-x-2 px-8 py-3 text-base">
              <span>Book a Demo</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl animate-fade-in opacity-0" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-intervue-600 dark:text-intervue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white">Streamlined Process</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Efficient end-to-end interview management</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-intervue-600 dark:text-intervue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white">Expert Interviewers</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Access to industry-specialized interviewers</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-intervue-600 dark:text-intervue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white">Smart Analytics</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Data-driven insights for better decisions</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Dashboard preview */}
        <div className="mt-20 animate-on-scroll">
          <div className="glass-panel p-2 md:p-3 max-w-5xl mx-auto shadow-xl">
            <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden">
              <div className="h-8 bg-slate-100 dark:bg-slate-700 flex items-center px-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
              </div>
              <div className="p-4 md:p-6">
                <div className="h-[300px] md:h-[400px] bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                  <p className="text-slate-500 dark:text-slate-400 font-medium">Dashboard Preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
