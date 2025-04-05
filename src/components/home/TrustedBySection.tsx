
import React from 'react';
import useAnimateOnScroll from '../../hooks/useAnimateOnScroll';

// Trusted by companies
const trustedCompanies = [
  "public/lovable-uploads/cea52ef0-c483-4fb0-81b0-7b79916692a7.png",
  "public/lovable-uploads/cfd55ffb-3647-4d65-95d1-e32e8bb21830.png"
];

const TrustedBySection: React.FC = () => {
  useAnimateOnScroll();
  
  return (
    <section className="py-12 bg-background border-b border-border">
      <div className="container mx-auto px-4">
        <p className="text-center text-foreground/60 mb-8 text-sm font-medium uppercase tracking-wide">
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

export default TrustedBySection;
