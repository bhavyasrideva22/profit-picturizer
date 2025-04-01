
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Sector
} from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProfitMarginChartProps {
  revenue: number;
  costOfGoodsSold: number;
  grossProfit: number;
  grossProfitMargin: number;
}

// Format currency in Indian Rupee
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

// Custom tooltip for Recharts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-dark-green font-semibold">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

// Custom tooltip for Pie Chart
const PieCustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
        <p className="text-sm font-medium">{payload[0].name}</p>
        <p className="text-sm text-dark-green font-semibold">
          {formatCurrency(payload[0].value)}
        </p>
        <p className="text-xs text-gray-500">
          {payload[0].payload.percentage}% of revenue
        </p>
      </div>
    );
  }
  return null;
};

// Active shape for pie chart to create a donut
const renderActiveShape = (props: any) => {
  const { 
    cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value 
  } = props;

  return (
    <g>
      <text x={cx} y={cy} dy={-20} textAnchor="middle" fill="#245e4f" className="text-xl font-bold">
        {payload.name}
      </text>
      <text x={cx} y={cy} dy={10} textAnchor="middle" fill="#245e4f" className="text-base">
        {formatCurrency(value)}
      </text>
      <text x={cx} y={cy} dy={30} textAnchor="middle" fill="#245e4f" className="text-sm">
        {payload.percentage}% of revenue
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
    </g>
  );
};

const ProfitMarginChart = ({ 
  revenue, 
  costOfGoodsSold, 
  grossProfit,
  grossProfitMargin 
}: ProfitMarginChartProps) => {
  const isMobile = useIsMobile();
  const [activeIndex, setActiveIndex] = React.useState(0);

  const barData = [
    { name: 'Revenue', value: revenue, color: '#245e4f' },
    { name: 'COGS', value: costOfGoodsSold, color: '#e9c46a' },
    { name: 'Gross Profit', value: grossProfit, color: '#7ac9a7' },
  ];

  const pieData = [
    { 
      name: 'COGS', 
      value: costOfGoodsSold, 
      percentage: (100 - grossProfitMargin).toFixed(2),
      color: '#e9c46a'
    },
    { 
      name: 'Gross Profit', 
      value: grossProfit, 
      percentage: grossProfitMargin.toFixed(2),
      color: '#7ac9a7'
    },
  ];

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className="w-full h-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="w-full h-[300px]">
          <h3 className="text-center text-dark-green font-medium mb-3">Financial Breakdown</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 30,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#333' }}
                tickLine={false}
                axisLine={{ stroke: '#e0e0e0' }}
              />
              <YAxis 
                tick={{ fill: '#333' }}
                tickLine={false}
                axisLine={{ stroke: '#e0e0e0' }}
                tickFormatter={(value) => {
                  if (value >= 1000000) {
                    return `${(value / 1000000).toFixed(1)}M`;
                  } else if (value >= 1000) {
                    return `${(value / 1000).toFixed(0)}K`;
                  }
                  return value;
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full h-[300px]">
          <h3 className="text-center text-dark-green font-medium mb-3">Profit Margin Analysis</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                dataKey="value"
                onMouseEnter={onPieEnter}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<PieCustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value, entry, index) => (
                  <span className="text-charcoal">{value}: {pieData[index].percentage}%</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Profit Margin Gauge */}
      <div className="mt-8 p-5 bg-cream rounded-lg border border-mint-green/50">
        <h3 className="text-center text-dark-green font-medium mb-4">Gross Profit Margin Indicator</h3>
        <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="absolute inset-0 flex items-center"
            style={{ 
              width: `${Math.min(100, Math.max(0, grossProfitMargin))}%`,
              background: `linear-gradient(90deg, #e9c46a, #7ac9a7)`,
              transition: "width 1s ease-in-out"
            }}
          >
            {grossProfitMargin >= 15 && (
              <span className="ml-2 text-dark-green font-bold">
                {grossProfitMargin.toFixed(2)}%
              </span>
            )}
          </div>
          {grossProfitMargin < 15 && (
            <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-charcoal font-bold">
              {grossProfitMargin.toFixed(2)}%
            </span>
          )}
        </div>
        <div className="flex justify-between mt-1 text-xs text-charcoal">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
        
        <div className="mt-4 text-center">
          {grossProfitMargin < 0 && (
            <p className="text-red-500 font-medium">Your business is operating at a loss.</p>
          )}
          {grossProfitMargin >= 0 && grossProfitMargin < 15 && (
            <p className="text-yellow-600 font-medium">Below average margin. Consider strategies to improve profitability.</p>
          )}
          {grossProfitMargin >= 15 && grossProfitMargin < 30 && (
            <p className="text-blue-600 font-medium">Average margin. Your business is doing reasonably well.</p>
          )}
          {grossProfitMargin >= 30 && grossProfitMargin < 50 && (
            <p className="text-green-600 font-medium">Good margin. Your business is performing above average.</p>
          )}
          {grossProfitMargin >= 50 && (
            <p className="text-dark-green font-medium">Excellent margin! Your business is highly profitable.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfitMarginChart;
