
import React from 'react';
import { Link } from 'react-router-dom';
import { useAnimateOnScroll } from '../../hooks/useAnimateOnScroll';
import { ArrowRight } from 'lucide-react';

const CallToAction: React.FC = () => {
  useAnimateOnScroll();
  
  return (
    <section className="py-20 bg-gradient-to-r from-purple-900 to-purple-700 text-white relative overflow-hidden">
      {/* Background animated wave effect */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 animate-wave" style={{ background: 'url(/public/lovable-uploads/270e37c3-6bd1-4266-905b-05745a0bb8a7.png) repeat', backgroundSize: '100%', zIndex: 0 }}></div>
      </div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 max-w-3xl mx-auto animate-on-scroll">
          Ready to Revolutionize Your Technical Hiring?
        </h2>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto animate-on-scroll">
          Join forward-thinking companies already saving time and making better hires with Hirevantage.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 animate-on-scroll">
          <Link 
            to="/register" 
            className="bg-white text-purple-700 hover:bg-slate-100 transition-colors duration-300 font-medium rounded-lg px-8 py-3.5 shadow-lg hover:shadow-xl flex items-center justify-center"
          >
            Get Started Free <ArrowRight className="ml-2 w-4 h-4" />
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
