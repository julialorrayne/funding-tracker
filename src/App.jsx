import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import './components/FundingDataLoader.css';

const FundingDataLoader = () => {
  const [barChartData, setBarChartData] = useState(null);
  const [lineChartData, setLineChartData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFundingData = async () => {
      try {
        const response = await fetch('/funding.json');
        if (!response.ok) {
          throw new Error('Failed to fetch funding data');
        }
        const data = await response.json();

        // Calculate total funding per year
        const fundingByYear = data.reduce((acc, item) => {
          acc[item.year] = (acc[item.year] || 0) + item.amount;
          return acc;
        }, {});
        const years = Object.keys(fundingByYear).sort();
        const totals = years.map(year => fundingByYear[year]);

        setBarChartData({
          labels: years,
          datasets: [
            {
              label: 'Total Funding ($)',
              data: totals,
              backgroundColor: 'rgba(153, 102, 255, 0.6)',
              borderColor: 'rgba(153, 102, 255, 1)',
              borderWidth: 1,
            },
          ],
        });

        // Group data by industry and year
        const fundingByIndustryAndYear = data.reduce((acc, item) => {
          if (!acc[item.industry]) {
            acc[item.industry] = {};
          }
          acc[item.industry][item.year] = (acc[item.industry][item.year] || 0) + item.amount;
          return acc;
        }, {});
        const lineDatasets = Object.keys(fundingByIndustryAndYear).map((industry, index) => {
          const industryData = fundingByIndustryAndYear[industry];
          return {
            label: industry,
            data: years.map(year => industryData[year] || 0),
            fill: false,
            borderColor: predefinedColors[index % predefinedColors.length],
            tension: 0.4,
          };
        });

        setLineChartData({
          labels: years,
          datasets: lineDatasets,
        });
      } catch (error) {
        console.error('Error fetching funding data:', error);
        setError('Failed to load funding data. Please try again later.');
      }
    };

    fetchFundingData();
  }, []);

  const predefinedColors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF',
  ];

  return (
    <div className="container">
      <h1>Funding Tracker</h1>
      {error ? (
        <p className="error">{error}</p>
      ) : (
        <>
          <div className="chart-container">
            <h2>Total Funding by Year</h2>
            {barChartData ? (
              <Bar
                data={barChartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: true,
                      position: 'top',
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
                        text: 'Total Funding ($)',
                      },
                      beginAtZero: true,
                    },
                  },
                }}
              />
            ) : (
              <p>Loading bar chart...</p>
            )}
          </div>

          <div className="chart-container">
            <h2>Funding Trends by Industry</h2>
            {lineChartData ? (
              <Line
                data={lineChartData}
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
              <p>Loading line chart...</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default FundingDataLoader;