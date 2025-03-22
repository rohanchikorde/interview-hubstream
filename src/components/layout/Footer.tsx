
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo and description */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-intervue-600 flex items-center justify-center text-white font-bold text-lg">
                I
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">Intervue</span>
            </Link>
            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md">
              Intervue streamlines the hiring process by providing a centralized platform for managing interview requirements, candidates, and payments.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-500 hover:text-intervue-600 dark:text-slate-400 dark:hover:text-intervue-400 transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-slate-500 hover:text-intervue-600 dark:text-slate-400 dark:hover:text-intervue-400 transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Product
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/for-companies" className="text-slate-600 hover:text-intervue-600 dark:text-slate-400 dark:hover:text-intervue-400 transition-colors">
                  For Companies
                </Link>
              </li>
              <li>
                <Link to="/for-interviewers" className="text-slate-600 hover:text-intervue-600 dark:text-slate-400 dark:hover:text-intervue-400 transition-colors">
                  For Interviewers
                </Link>
              </li>
              <li>
                <Link to="/for-candidates" className="text-slate-600 hover:text-intervue-600 dark:text-slate-400 dark:hover:text-intervue-400 transition-colors">
                  For Candidates
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-slate-600 hover:text-intervue-600 dark:text-slate-400 dark:hover:text-intervue-400 transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-slate-600 hover:text-intervue-600 dark:text-slate-400 dark:hover:text-intervue-400 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-slate-600 hover:text-intervue-600 dark:text-slate-400 dark:hover:text-intervue-400 transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-slate-600 hover:text-intervue-600 dark:text-slate-400 dark:hover:text-intervue-400 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-600 hover:text-intervue-600 dark:text-slate-400 dark:hover:text-intervue-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy" className="text-slate-600 hover:text-intervue-600 dark:text-slate-400 dark:hover:text-intervue-400 transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-slate-600 hover:text-intervue-600 dark:text-slate-400 dark:hover:text-intervue-400 transition-colors">
                  Terms
                </Link>
              </li>
              <li>
                <Link to="/security" className="text-slate-600 hover:text-intervue-600 dark:text-slate-400 dark:hover:text-intervue-400 transition-colors">
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:justify-between md:items-center">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} Intervue. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link to="/terms" className="text-sm text-slate-500 hover:text-intervue-600 dark:text-slate-400 dark:hover:text-intervue-400 transition-colors">
              Terms of Service
            </Link>
            <Link to="/privacy" className="text-sm text-slate-500 hover:text-intervue-600 dark:text-slate-400 dark:hover:text-intervue-400 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/cookies" className="text-sm text-slate-500 hover:text-intervue-600 dark:text-slate-400 dark:hover:text-intervue-400 transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
