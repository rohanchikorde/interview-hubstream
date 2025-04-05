
import React from 'react';
import { Link } from 'react-router-dom';
import useAnimateOnScroll from '../../hooks/useAnimateOnScroll';

const CallToAction: React.FC = () => {
  useAnimateOnScroll();
  
  return (
    <section className="py-20 bg-gradient-to-r from-purple-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 max-w-3xl mx-auto animate-on-scroll">
          Ready to Revolutionize Your Technical Hiring?
        </h2>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto animate-on-scroll">
          Join forward-thinking companies already saving time and making better hires with Hirevantage.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 animate-on-scroll">
          <Link 
            to="/register" 
            className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-300 font-medium rounded-lg px-8 py-3.5 shadow-purple"
          >
            Get Started Free
          </Link>
          <Link 
            to="/request-demo" 
            className="bg-transparent text-white border-2 border-white hover:bg-white/10 transition-colors duration-300 font-medium rounded-lg px-8 py-3.5"
          >
            Request a Demo
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
