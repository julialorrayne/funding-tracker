import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

const FundingDataLoader = () => {
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFundingData = async () => {
      try {
        const response = await fetch('/funding.json'); // Ensure funding.json is in the public folder
        if (!response.ok) {
          throw new Error('Failed to fetch funding data');
        }
        const data = await response.json();

        // Group data by industry and year
        const fundingByIndustryAndYear = data.reduce((acc, item) => {
          if (!acc[item.industry]) {
            acc[item.industry] = {};
          }
          acc[item.industry][item.year] = (acc[item.industry][item.year] || 0) + item.amount;
          return acc;
        }, {});

        // Prepare data for the chart
        const years = [...new Set(data.map(item => item.year))].sort();
        const datasets = Object.keys(fundingByIndustryAndYear).map((industry, index) => {
          const industryData = fundingByIndustryAndYear[industry];
          return {
            label: industry,
            data: years.map(year => industryData[year] || 0),
            fill: false,
            borderColor: predefinedColors[index % predefinedColors.length], // Use predefined colors
            tension: 0.4, // Smooth lines
          };
        });

        setChartData({
          labels: years,
          datasets,
        });
      } catch (error) {
        console.error('Error fetching funding data:', error);
        setError('Failed to load funding data. Please try again later.');
      }
    };

    fetchFundingData();
  }, []);

  // Predefined color palette for better visualization
  const predefinedColors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF',
  ];

  return (
    <div>
      <h1>Funding Trends by Industry</h1>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : chartData ? (
        <Line
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: true,
                position: 'top',
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    return `${context.dataset.label}: $${context.raw.toLocaleString()}`;
                  },
                },
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Year',
                },
              },
              y: {
                title: {
                  display: true,
                  text: 'Funding Amount ($)',
                },
                beginAtZero: true,
              },
            },
          }}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default FundingDataLoader;