import React from "react";

// Utility function to format snake_case to Capitalized format
const formatText = (text: string): string => {
  return text
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Define the type for the indicators array
interface Indicator {
  indicator_id: string;
  category: string;
  title: string;
  description: string;
  
}

interface IndicatorsListProps {
  indicators: Indicator[];
}

const IndicatorsList: React.FC<IndicatorsListProps> = ({ indicators }) => {
  return (
    <div className="w-full mx-auto px-4 py-4">
    
      <div className="grid grid-cols-1 gap-6">
        {indicators.map((indicator, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300"
          >
            <h2 className="text-xl font-semibold mb-2 text-blue-600">
              {indicator.title}
            </h2>
            <p className="text-sm text-gray-500">
              <strong>Category:</strong> {formatText(indicator.category)}
            </p>
            
            <p className="text-gray-700 mb-4">{indicator.description}</p>
            
            <p className="text-sm text-gray-500">
              <strong>Indicator ID:</strong> {formatText(indicator.indicator_id)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IndicatorsList;
