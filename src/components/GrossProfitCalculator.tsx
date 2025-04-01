
import React, { useState, useCallback } from 'react';
import { Calculator, Download, Mail, RefreshCw, HelpCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/components/ui/sonner";
import { Separator } from "@/components/ui/separator";
import ProfitMarginChart from './ProfitMarginChart';
import PdfGenerator from './PdfGenerator';
import { useIsMobile } from '@/hooks/use-mobile';

// Format currency in Indian Rupee
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

// Format percentage
const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};

const GrossProfitCalculator = () => {
  const isMobile = useIsMobile();
  
  // State for inputs and calculated values
  const [revenue, setRevenue] = useState<string>('100000');
  const [costOfGoodsSold, setCostOfGoodsSold] = useState<string>('60000');
  const [email, setEmail] = useState<string>('');
  const [showEmailForm, setShowEmailForm] = useState<boolean>(false);
  const [isCalculated, setIsCalculated] = useState<boolean>(false);
  
  // Calculated results
  const [grossProfit, setGrossProfit] = useState<number>(0);
  const [grossProfitMargin, setGrossProfitMargin] = useState<number>(0);

  // Handle calculation
  const calculateProfitMargin = useCallback(() => {
    if (!revenue || !costOfGoodsSold) {
      toast('Please enter both revenue and cost of goods sold', {
        description: 'All fields are required for calculation.',
      });
      return;
    }

    const revenueValue = parseFloat(revenue);
    const costValue = parseFloat(costOfGoodsSold);

    if (isNaN(revenueValue) || isNaN(costValue)) {
      toast('Please enter valid numbers', {
        description: 'Revenue and cost must be numeric values.',
      });
      return;
    }

    if (revenueValue <= 0) {
      toast('Revenue must be greater than zero', {
        description: 'Please enter a positive value for revenue.',
      });
      return;
    }

    if (costValue < 0) {
      toast('Cost cannot be negative', {
        description: 'Please enter a non-negative value for cost.',
      });
      return;
    }

    if (costValue > revenueValue) {
      toast('Warning: Cost exceeds revenue', {
        description: 'This will result in a negative profit margin.',
      });
    }

    // Calculate gross profit and margin
    const profit = revenueValue - costValue;
    const margin = (profit / revenueValue) * 100;

    setGrossProfit(profit);
    setGrossProfitMargin(margin);
    setIsCalculated(true);

    toast('Calculation complete', {
      description: 'Your gross profit margin has been calculated successfully.',
    });
  }, [revenue, costOfGoodsSold]);

  // Reset calculator
  const resetCalculator = () => {
    setRevenue('100000');
    setCostOfGoodsSold('60000');
    setGrossProfit(0);
    setGrossProfitMargin(0);
    setIsCalculated(false);
    toast('Calculator reset', {
      description: 'All values have been reset to default.',
    });
  };

  // Handle email sending
  const handleSendEmail = () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast('Invalid email address', {
        description: 'Please enter a valid email address.',
      });
      return;
    }

    if (!isCalculated) {
      toast('No calculation to send', {
        description: 'Please calculate your profit margin first.',
      });
      return;
    }

    // In a real app, you would send this to your backend
    // For now, we'll just show a success message
    toast('Email sent!', {
      description: 'The calculation results have been sent to your email.',
    });
    setShowEmailForm(false);
  };

  // Chart data
  const chartData = [
    { name: 'Revenue', value: parseFloat(revenue) || 0 },
    { name: 'COGS', value: parseFloat(costOfGoodsSold) || 0 },
    { name: 'Gross Profit', value: grossProfit },
  ];

  return (
    <div className="section-container animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calculator Card */}
        <Card className="lg:col-span-1 card-shadow">
          <CardHeader className="bg-dark-green text-white rounded-t-md">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
                <Calculator size={20} />
                Gross Profit Margin Calculator
              </CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-white">
                      <HelpCircle size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Gross profit margin measures the percentage of revenue that exceeds the cost of goods sold.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <CardDescription className="text-mint-green">
              Calculate your business's profitability with ease
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="revenue" className="text-dark-green">Revenue (₹)</Label>
              <Input
                id="revenue"
                type="number"
                placeholder="Enter total revenue"
                value={revenue}
                onChange={(e) => setRevenue(e.target.value)}
                className="input-field"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cogs" className="text-dark-green">Cost of Goods Sold (₹)</Label>
              <Input
                id="cogs"
                type="number"
                placeholder="Enter cost of goods sold"
                value={costOfGoodsSold}
                onChange={(e) => setCostOfGoodsSold(e.target.value)}
                className="input-field"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button onClick={calculateProfitMargin} className="bg-dark-green hover:bg-opacity-90 text-white">
                Calculate
              </Button>
              <Button onClick={resetCalculator} variant="outline" className="border-dark-green text-dark-green">
                <RefreshCw size={16} className="mr-2" />
                Reset
              </Button>
            </div>
          </CardContent>

          {isCalculated && (
            <>
              <Separator className="my-2" />
              <CardContent className="space-y-4">
                <div className="bg-cream rounded-md p-4 border border-mint-green">
                  <h3 className="text-lg font-medium text-dark-green mb-3">Results</h3>
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <p className="text-sm text-charcoal/70">Gross Profit:</p>
                      <p className="text-xl font-semibold text-dark-green">{formatCurrency(grossProfit)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-charcoal/70">Gross Profit Margin:</p>
                      <p className="text-2xl font-bold text-dark-green">{formatPercentage(grossProfitMargin)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col sm:flex-row gap-2">
                {showEmailForm ? (
                  <div className="w-full space-y-2">
                    <div className="flex gap-2">
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-grow"
                      />
                      <Button onClick={handleSendEmail} className="bg-soft-blue hover:bg-opacity-90">
                        Send
                      </Button>
                    </div>
                    <Button 
                      variant="ghost" 
                      className="text-xs" 
                      onClick={() => setShowEmailForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button 
                      onClick={() => setShowEmailForm(true)} 
                      variant="outline"
                      className="text-soft-blue border-soft-blue hover:bg-soft-blue/10"
                    >
                      <Mail size={16} className="mr-2" />
                      Email Results
                    </Button>
                    <PdfGenerator 
                      revenue={parseFloat(revenue)} 
                      costOfGoodsSold={parseFloat(costOfGoodsSold)}
                      grossProfit={grossProfit}
                      grossProfitMargin={grossProfitMargin}
                    />
                  </>
                )}
              </CardFooter>
            </>
          )}
        </Card>

        {/* Results and Chart Card */}
        <Card className={`${isMobile ? '' : 'lg:col-span-2'} card-shadow h-full`}>
          <CardHeader className="bg-mint-green/20 rounded-t-md">
            <CardTitle className="text-xl font-semibold text-dark-green">
              Profit Margin Visualization
            </CardTitle>
            <CardDescription>
              Visual representation of your revenue, costs, and profit
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="min-h-[300px] flex items-center justify-center">
              {isCalculated ? (
                <ProfitMarginChart 
                  revenue={parseFloat(revenue)} 
                  costOfGoodsSold={parseFloat(costOfGoodsSold)} 
                  grossProfit={grossProfit}
                  grossProfitMargin={grossProfitMargin}
                />
              ) : (
                <div className="text-center text-muted-foreground">
                  <Calculator size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p>Calculate your profit margin to see the visualization</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Explanation Section */}
      <div className="mt-12 bg-white rounded-lg p-6 card-shadow">
        <h2 className="text-2xl font-semibold text-dark-green mb-4">Understanding Gross Profit Margin</h2>
        
        <div className="space-y-4">
          <p className="text-charcoal leading-relaxed">
            The gross profit margin is a key financial metric that measures the profitability of a business after accounting for the costs directly related to producing the goods or services it sells. It's one of the most important indicators of a company's financial health and operational efficiency.
          </p>
          
          <h3 className="text-xl font-medium text-dark-green mt-6">How to Calculate Gross Profit Margin</h3>
          <p className="text-charcoal leading-relaxed">
            To calculate gross profit margin, you need two primary figures: your total revenue and the cost of goods sold (COGS). The formula is:
          </p>
          <div className="bg-cream p-4 rounded-md border border-mint-green/50 my-3">
            <p className="text-center font-medium">Gross Profit Margin = ((Revenue - Cost of Goods Sold) / Revenue) × 100%</p>
          </div>
          
          <h3 className="text-xl font-medium text-dark-green mt-6">Why Gross Profit Margin Matters</h3>
          <ul className="list-disc pl-5 space-y-2 text-charcoal">
            <li><span className="font-medium">Measures efficiency:</span> A higher gross profit margin indicates that a company can produce its goods or services more efficiently.</li>
            <li><span className="font-medium">Competitive analysis:</span> Compare your margins with competitors to understand your market position.</li>
            <li><span className="font-medium">Pricing strategy:</span> Helps in setting appropriate prices for your products or services.</li>
            <li><span className="font-medium">Investment decisions:</span> Investors often examine gross profit margins when evaluating companies.</li>
            <li><span className="font-medium">Business planning:</span> Guides decisions on cost management, pricing, and growth strategies.</li>
          </ul>
          
          <h3 className="text-xl font-medium text-dark-green mt-6">Industry Benchmarks</h3>
          <p className="text-charcoal leading-relaxed">
            Gross profit margins vary significantly across industries. For example:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-charcoal">
            <li>Retail businesses typically have margins between 25% and 35%</li>
            <li>Manufacturing companies often range from 25% to 40%</li>
            <li>Service-based businesses may see margins of 40% to 75%</li>
            <li>Software and technology companies can achieve margins of 70% to 90%</li>
          </ul>
          
          <h3 className="text-xl font-medium text-dark-green mt-6">Strategies to Improve Your Gross Profit Margin</h3>
          <ol className="list-decimal pl-5 space-y-2 text-charcoal">
            <li><span className="font-medium">Optimize pricing:</span> Regularly review and adjust your pricing strategy based on market conditions, customer value perception, and competitive analysis.</li>
            <li><span className="font-medium">Reduce COGS:</span> Negotiate better terms with suppliers, optimize your supply chain, or find alternative suppliers with better rates.</li>
            <li><span className="font-medium">Improve operational efficiency:</span> Streamline production processes, reduce waste, and implement technology to automate tasks.</li>
            <li><span className="font-medium">Focus on high-margin products:</span> Analyze which products or services generate the highest margins and consider reallocating resources accordingly.</li>
            <li><span className="font-medium">Volume purchasing:</span> Take advantage of bulk discounts by purchasing larger quantities when appropriate.</li>
          </ol>
          
          <div className="bg-mint-green/10 p-4 rounded-md border border-mint-green mt-6">
            <h4 className="font-medium text-dark-green mb-2">Pro Tip</h4>
            <p className="text-charcoal">
              While gross profit margin is important, it's best to analyze it alongside other financial metrics such as net profit margin, operating margin, and return on investment for a comprehensive view of your business's financial health.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrossProfitCalculator;
