
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import useAnimateOnScroll from '@/hooks/useAnimateOnScroll';

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  useAnimateOnScroll();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Your pricing request has been submitted. We'll be in touch shortly!");
    setTimeout(() => {
      navigate('/');
    }, 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Navbar />
      
      <main className="flex-1 pt-28">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-on-scroll">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient-purple">Pricing and Features</h1>
            <p className="text-lg text-slate-400">Find the perfect plan for your technical hiring needs</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 items-start max-w-6xl mx-auto">
            {/* Left Column - Pricing Card */}
            <div className="glass-card p-8 md:p-10 animate-on-scroll">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">
                  Enterprise Plan
                </h3>
                <div className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full">
                  Popular
                </div>
              </div>
              
              <div className="mb-8">
                <span className="text-4xl font-bold">$19</span>
                <span className="text-slate-400 ml-2">per seat / month</span>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <div className="bg-purple-500 rounded-full p-1 mt-1 mr-3">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-slate-300">Unlimited technical interviews</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-purple-500 rounded-full p-1 mt-1 mr-3">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-slate-300">Custom hiring workflows</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-purple-500 rounded-full p-1 mt-1 mr-3">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-slate-300">Advanced reporting & analytics</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-purple-500 rounded-full p-1 mt-1 mr-3">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-slate-300">API access & integrations</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-purple-500 rounded-full p-1 mt-1 mr-3">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-slate-300">Dedicated account manager</span>
                </li>
              </ul>
              
              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-medium py-3"
              >
                Request Custom Quote
              </Button>
            </div>
            
            {/* Right Column - Form */}
            <div className="glass-card p-8 md:p-10 animate-on-scroll">
              <h3 className="text-2xl font-bold text-white mb-6 text-left">
                Get a personalized quote
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="form-label">Email <span className="text-red-500">*</span></Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Enter your email" 
                    required 
                    className="form-input bg-white/5 text-white border-slate-700"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone" className="form-label">Phone number <span className="text-red-500">*</span></Label>
                  <div className="flex gap-2">
                    <div className="w-24">
                      <div className="flex items-center bg-white/5 border border-slate-700 rounded-md px-3 h-10">
                        <span className="text-sm text-slate-300">IN +91</span>
                        <svg width="12" height="12" viewBox="0 0 12 12" className="ml-2" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="Enter your phone number" 
                      required 
                      className="form-input flex-1 bg-white/5 text-white border-slate-700"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name" className="form-label">Full Name <span className="text-red-500">*</span></Label>
                  <Input 
                    id="name" 
                    type="text" 
                    placeholder="Enter your name" 
                    required 
                    className="form-input bg-white/5 text-white border-slate-700"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="form-label">Your company size <span className="text-red-500">*</span></Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="flex">
                      <input type="radio" id="size-1-29" name="company-size" value="1-29" className="sr-only peer" required />
                      <label htmlFor="size-1-29" className="flex items-center justify-center w-full py-2.5 text-sm font-medium rounded-md border border-slate-700 cursor-pointer peer-checked:bg-purple-900/50 peer-checked:border-purple-500 peer-checked:text-white hover:bg-slate-800">
                        1-29
                      </label>
                    </div>
                    <div className="flex">
                      <input type="radio" id="size-30-249" name="company-size" value="30-249" className="sr-only peer" />
                      <label htmlFor="size-30-249" className="flex items-center justify-center w-full py-2.5 text-sm font-medium rounded-md border border-slate-700 cursor-pointer peer-checked:bg-purple-900/50 peer-checked:border-purple-500 peer-checked:text-white hover:bg-slate-800">
                        30-249
                      </label>
                    </div>
                    <div className="flex">
                      <input type="radio" id="size-250-4999" name="company-size" value="250-4999" className="sr-only peer" />
                      <label htmlFor="size-250-4999" className="flex items-center justify-center w-full py-2.5 text-sm font-medium rounded-md border border-slate-700 cursor-pointer peer-checked:bg-purple-900/50 peer-checked:border-purple-500 peer-checked:text-white hover:bg-slate-800">
                        250-4999
                      </label>
                    </div>
                    <div className="flex">
                      <input type="radio" id="size-5000+" name="company-size" value="5000+" className="sr-only peer" />
                      <label htmlFor="size-5000+" className="flex items-center justify-center w-full py-2.5 text-sm font-medium rounded-md border border-slate-700 cursor-pointer peer-checked:bg-purple-900/50 peer-checked:border-purple-500 peer-checked:text-white hover:bg-slate-800">
                        5000+
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-medium rounded-lg py-3 px-4 flex items-center justify-center gap-2"
                  >
                    Request Pricing
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Pricing;
