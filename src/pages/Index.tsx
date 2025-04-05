
import React, { useEffect } from 'react';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import HowItWorks from '@/components/home/HowItWorks';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Quote, BarChart3, Clock, Award, Users, Zap, Shield, Target, BriefcaseIcon, CheckCircle, CalendarIcon } from 'lucide-react';

// Testimonial data
const testimonials = [
  {
    quote: "Hirevantage has completely transformed our technical hiring process. We've seen a 35% reduction in time-to-hire and significantly better quality candidates advancing to final rounds.",
    author: "Sarah Johnson",
    title: "VP of Engineering, TechCorp",
    image: "public/lovable-uploads/b54002b7-7dd5-46f2-9dbd-c6bc5684c4cd.png"
  },
  {
    quote: "The expert interviewers at Hirevantage provide consistent, high-quality assessments that our team can trust. It's saved our engineering managers countless hours while improving our hiring decisions.",
    author: "Michael Chen",
    title: "CTO, GrowthScale",
    image: "public/lovable-uploads/3d70235c-edbf-4061-bbbc-859abf6c2541.png"
  },
  {
    quote: "Using Hirevantage gives us access to specialized interviewers we couldn't find internally. The detailed feedback reports help us make confident hiring decisions even for niche technical roles.",
    author: "Elena Rodriguez",
    title: "Head of Talent Acquisition, Innovex",
    image: "public/lovable-uploads/5e22158d-dced-4a78-93d6-cc49ca0f1bab.png"
  }
];

// Stats data
const stats = [
  {
    value: "40%",
    label: "Time-to-hire reduction",
    icon: <Clock className="w-6 h-6 text-blue-500 dark:text-blue-400" />
  },
  {
    value: "87%",
    label: "Interview consistency",
    icon: <Award className="w-6 h-6 text-blue-500 dark:text-blue-400" />
  },
  {
    value: "500+",
    label: "Specialized interviewers",
    icon: <Users className="w-6 h-6 text-blue-500 dark:text-blue-400" />
  },
  {
    value: "92%",
    label: "Client satisfaction rate",
    icon: <Star className="w-6 h-6 text-blue-500 dark:text-blue-400" />
  }
];

// Trusted by companies
const trustedCompanies = [
  "public/lovable-uploads/cea52ef0-c483-4fb0-81b0-7b79916692a7.png",
  "public/lovable-uploads/cfd55ffb-3647-4d65-95d1-e32e8bb21830.png"
];

const Index: React.FC = () => {
  // Animation on scroll initialization
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      
      elements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        
        if (rect.top <= windowHeight * 0.85) {
          element.classList.add('visible');
        }
      });
    };

    // Initial check for elements in view
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <Hero />
        <TrustedBySection />
        <Features />
        <HowHiringWorksSection />
        <StatsSection />
        <HowItWorks />
        <WhyChooseUsSection />
        <TestimonialsSection />
        
        {/* Call to Action Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-teal-500 text-white">
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
                className="bg-white text-blue-600 hover:bg-slate-100 transition-colors duration-300 font-medium rounded-lg px-8 py-3.5 shadow-lg hover:shadow-xl"
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
      </main>
      
      <Footer />
    </div>
  );
};

// Testimonials Section Component
const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-blue-500 dark:text-blue-400 font-medium mb-2 block">Success Stories</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Hear From Our Clients
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Companies of all sizes are transforming their hiring processes with Hirevantage.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 animate-on-scroll"
            >
              <div className="flex justify-center mb-6">
                <Quote className="w-10 h-10 text-blue-300 dark:text-blue-500/50" />
              </div>
              <p className="text-slate-700 dark:text-slate-300 mb-6 text-center">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center justify-center">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white">{testimonial.author}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Stats Section Component
const StatsSection: React.FC = () => {
  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-800/50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-blue-500 dark:text-blue-400 font-medium mb-2 block">By The Numbers</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Real Results That Matter
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Our platform delivers measurable improvements to your technical hiring process.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 text-center shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-on-scroll"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="bg-blue-50 dark:bg-blue-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                {stat.icon}
              </div>
              <h3 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">{stat.value}</h3>
              <p className="text-slate-600 dark:text-slate-300">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Trusted By Section Component
const TrustedBySection: React.FC = () => {
  return (
    <section className="py-12 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
      <div className="container mx-auto px-4">
        <p className="text-center text-slate-500 dark:text-slate-400 mb-8 text-sm font-medium uppercase tracking-wide">
          Trusted By Industry Leaders Worldwide
        </p>
        
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16">
          {trustedCompanies.map((logo, index) => (
            <div 
              key={index}
              className="grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300"
            >
              <img src={logo} alt="Client logo" className="h-8 md:h-10 w-auto object-contain" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// How Hiring Works Section Component (New)
const HowHiringWorksSection: React.FC = () => {
  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-blue-500 dark:text-blue-400 font-medium mb-2 block">Simple Process</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            How Technical Hiring Works
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Our streamlined approach makes hiring top technical talent fast and efficient
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="relative">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                1
              </div>
              <div className="mb-6 h-16 flex items-center justify-center">
                <BriefcaseIcon className="w-12 h-12 text-blue-500 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 text-center">Define Requirements</h3>
              <p className="text-slate-600 dark:text-slate-400 text-center">
                Specify skills, experience level, and other criteria for your ideal candidate
              </p>
            </div>
            
            <div className="hidden md:block absolute top-1/2 left-full transform -translate-y-1/2 translate-x-4">
              <ArrowRight className="w-6 h-6 text-blue-300 dark:text-blue-700" />
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                2
              </div>
              <div className="mb-6 h-16 flex items-center justify-center">
                <CalendarIcon className="w-12 h-12 text-blue-500 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 text-center">Schedule Interviews</h3>
              <p className="text-slate-600 dark:text-slate-400 text-center">
                We match you with expert technical interviewers and handle all scheduling
              </p>
            </div>
            
            <div className="hidden md:block absolute top-1/2 left-full transform -translate-y-1/2 translate-x-4">
              <ArrowRight className="w-6 h-6 text-blue-300 dark:text-blue-700" />
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                3
              </div>
              <div className="mb-6 h-16 flex items-center justify-center">
                <BarChart3 className="w-12 h-12 text-blue-500 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 text-center">Receive Detailed Reports</h3>
              <p className="text-slate-600 dark:text-slate-400 text-center">
                Get comprehensive evaluations and make data-driven hiring decisions
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <Link 
            to="/request-demo" 
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            <span>See How It Works</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

// Why Choose Us Section Component (New)
const WhyChooseUsSection: React.FC = () => {
  const benefits = [
    {
      icon: <Clock className="w-6 h-6 text-blue-500" />,
      title: "Save Engineering Time",
      description: "Free up your engineers from conducting interviews"
    },
    {
      icon: <Shield className="w-6 h-6 text-blue-500" />,
      title: "Reduce Hiring Risks",
      description: "Make confident decisions with thorough assessments"
    },
    {
      icon: <Zap className="w-6 h-6 text-blue-500" />,
      title: "Accelerate Hiring",
      description: "Cut your time-to-hire by up to 40%"
    },
    {
      icon: <Target className="w-6 h-6 text-blue-500" />,
      title: "Find the Right Fit",
      description: "Identify candidates with the exact skills you need"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-blue-500 dark:text-blue-400 font-medium mb-2 block">For Engineering Leaders</span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                Hire 10x Faster With Expert-Led Technical Interviews
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
                We help engineering leaders build high-performing teams while saving time and resources on the hiring process.
              </p>
              
              <div className="space-y-5">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="bg-white dark:bg-slate-800 p-2 rounded-full shadow-sm mt-0.5">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white text-lg">{benefit.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-10">
                <Link 
                  to="/request-demo" 
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <span>Request a Demo</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-64 h-64 bg-gradient-to-br from-blue-300/20 to-teal-300/20 rounded-full blur-3xl"></div>
              <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-xl overflow-hidden">
                <img 
                  src="public/lovable-uploads/82f6f44b-4cd4-4594-9bbd-cec58e1a29ec.png" 
                  alt="Hirevantage Platform" 
                  className="w-full" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end">
                  <div className="p-6 text-white">
                    <h3 className="text-xl font-semibold mb-2">Comprehensive Interview Platform</h3>
                    <p className="text-white/90">All the tools you need to streamline your technical hiring</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Index;

