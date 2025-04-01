
import React from 'react';
import GrossProfitCalculator from '@/components/GrossProfitCalculator';

const Index = () => {
  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-dark-green text-white py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl md:text-3xl font-bold text-white">Profit Picturizer</h1>
              <p className="text-mint-green text-sm md:text-base">Interactive Financial Calculators</p>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="py-8 md:py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-dark-green mb-4">Gross Profit Margin Calculator</h2>
              <p className="text-charcoal max-w-3xl mx-auto">
                Calculate and visualize your business's gross profit margin to make better financial decisions. 
                Our interactive calculator helps you understand your profitability at a glance.
              </p>
            </div>
            
            <GrossProfitCalculator />
          </div>
        </section>
      </main>
      
      <footer className="bg-dark-green text-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center">
            <p className="text-mint-green text-sm">
              © {new Date().getFullYear()} Profit Picturizer. All rights reserved.
            </p>
            <p className="text-xs text-white/70 mt-2">
              Designed for businesses to make better financial decisions
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
