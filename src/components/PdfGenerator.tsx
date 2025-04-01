import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Download } from 'lucide-react';
import { toast } from "sonner";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PdfGeneratorProps {
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

// Format percentage
const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};

const PdfGenerator = ({ 
  revenue, 
  costOfGoodsSold, 
  grossProfit, 
  grossProfitMargin 
}: PdfGeneratorProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  
  const generatePDF = async () => {
    // Create temporary element for PDF content
    const tempEl = document.createElement('div');
    tempEl.className = 'pdf-content';
    document.body.appendChild(tempEl);
    
    // Set the content of the temporary element
    tempEl.innerHTML = `
      <div style="padding: 40px; font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-bottom: 2px solid #245e4f; padding-bottom: 20px;">
          <div>
            <h1 style="color: #245e4f; margin: 0; font-size: 24px;">Profit Picturizer</h1>
            <p style="color: #7ac9a7; margin: 5px 0 0 0; font-size: 14px;">Gross Profit Margin Analysis</p>
          </div>
          <div style="text-align: right;">
            <p style="color: #333; margin: 0; font-size: 14px;">Generated on ${new Date().toLocaleDateString()}</p>
            <p style="color: #333; margin: 5px 0 0 0; font-size: 14px;">${new Date().toLocaleTimeString()}</p>
          </div>
        </div>
        
        <div style="margin-bottom: 30px;">
          <h2 style="color: #245e4f; margin-bottom: 15px; font-size: 18px;">Gross Profit Margin Summary</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="background-color: #f8f8f8;">
              <th style="padding: 10px; text-align: left; border: 1px solid #ddd; color: #333;">Metric</th>
              <th style="padding: 10px; text-align: right; border: 1px solid #ddd; color: #333;">Value</th>
            </tr>
            <tr>
              <td style="padding: 10px; text-align: left; border: 1px solid #ddd; color: #333;">Total Revenue</td>
              <td style="padding: 10px; text-align: right; border: 1px solid #ddd; color: #333; font-weight: bold;">${formatCurrency(revenue)}</td>
            </tr>
            <tr style="background-color: #f8f8f8;">
              <td style="padding: 10px; text-align: left; border: 1px solid #ddd; color: #333;">Cost of Goods Sold (COGS)</td>
              <td style="padding: 10px; text-align: right; border: 1px solid #ddd; color: #333; font-weight: bold;">${formatCurrency(costOfGoodsSold)}</td>
            </tr>
            <tr>
              <td style="padding: 10px; text-align: left; border: 1px solid #ddd; color: #333; font-weight: bold;">Gross Profit</td>
              <td style="padding: 10px; text-align: right; border: 1px solid #ddd; color: #245e4f; font-weight: bold;">${formatCurrency(grossProfit)}</td>
            </tr>
            <tr style="background-color: #f8f8f8;">
              <td style="padding: 10px; text-align: left; border: 1px solid #ddd; color: #333; font-weight: bold;">Gross Profit Margin</td>
              <td style="padding: 10px; text-align: right; border: 1px solid #ddd; color: #245e4f; font-weight: bold;">${formatPercentage(grossProfitMargin)}</td>
            </tr>
          </table>
        </div>
        
        <div style="margin-bottom: 30px;">
          <h2 style="color: #245e4f; margin-bottom: 15px; font-size: 18px;">Analysis</h2>
          <p style="color: #333; line-height: 1.5; margin-bottom: 15px;">
            Your gross profit of ${formatCurrency(grossProfit)} represents ${formatPercentage(grossProfitMargin)} of your total revenue. 
            ${
              grossProfitMargin < 0 
                ? 'Your business is currently operating at a loss for this period.' 
                : grossProfitMargin < 15 
                  ? 'This is below the average margin. Consider strategies to reduce costs or increase prices.' 
                  : grossProfitMargin < 30 
                    ? 'This is an average margin. Your business is doing reasonably well.' 
                    : grossProfitMargin < 50 
                      ? 'This is a good margin. Your business is performing above average in terms of profitability.' 
                      : 'This is an excellent margin! Your business is highly profitable.'
            }
          </p>
          
          <p style="color: #333; line-height: 1.5;">
            The gross profit margin is a key indicator of your business's financial health, measuring the efficiency of your core operations. It represents the percentage of each rupee of revenue that is left after accounting for the direct costs of producing your goods or services.
          </p>
        </div>
        
        <div style="margin-bottom: 30px;">
          <h2 style="color: #245e4f; margin-bottom: 15px; font-size: 18px;">Recommendations</h2>
          <ul style="color: #333; line-height: 1.5;">
            ${
              grossProfitMargin < 15 
                ? `
                  <li>Review your pricing strategy to ensure you're capturing the full value of your products/services</li>
                  <li>Analyze and reduce your cost of goods sold where possible</li>
                  <li>Consider focusing more on high-margin products or services</li>
                  <li>Negotiate better terms with suppliers</li>
                `
                : grossProfitMargin < 30
                  ? `
                    <li>Look for opportunities to further optimize your costs</li>
                    <li>Evaluate your product/service mix to emphasize higher-margin offerings</li>
                    <li>Consider modest price increases if your market will bear it</li>
                  `
                  : `
                    <li>Maintain your current operational efficiencies</li>
                    <li>Consider expanding your high-margin product/service lines</li>
                    <li>Reinvest profits into growth opportunities</li>
                    <li>Monitor competitors to maintain your competitive advantage</li>
                  `
            }
          </ul>
        </div>
        
        <div style="margin-top: 50px; border-top: 1px solid #ddd; padding-top: 20px; text-align: center;">
          <p style="color: #777; font-size: 12px;">
            This report was generated by Profit Picturizer. For more financial tools and calculators, please visit our website.
          </p>
          <p style="color: #777; font-size: 12px; margin-top: 5px;">
            © ${new Date().getFullYear()} Profit Picturizer. All rights reserved.
          </p>
        </div>
      </div>
    `;
    
    try {
      toast('Generating PDF...', {
        description: 'Please wait while we prepare your document.'
      });
      
      // Create the PDF from the temporary element
      const canvas = await html2canvas(tempEl, {
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // A4 dimensions: 210mm x 297mm
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Add new pages if content overflows
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Save the PDF
      pdf.save(`Gross_Profit_Analysis_${new Date().toISOString().split('T')[0]}.pdf`);
      
      toast('PDF generated successfully!', {
        description: 'Your document is ready for download.'
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast('Error generating PDF', {
        description: 'There was a problem creating your document. Please try again.'
      });
    } finally {
      // Clean up the temporary element
      if (tempEl && tempEl.parentNode) {
        tempEl.parentNode.removeChild(tempEl);
      }
    }
  };

  return (
    <Button 
      onClick={generatePDF} 
      variant="outline" 
      className="text-dark-green border-dark-green hover:bg-dark-green/10"
    >
      <Download size={16} className="mr-2" />
      Download PDF
    </Button>
  );
};

export default PdfGenerator;
