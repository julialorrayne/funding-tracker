import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

const FundingDataLoader = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchFundingData = async () => {
      try {
        const response = await fetch('/funding.json'); // Adjust the path if necessary
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
        const datasets = Object.keys(fundingByIndustryAndYear).map(industry => {
          const industryData = fundingByIndustryAndYear[industry];
          return {
            label: industry,
            data: years.map(year => industryData[year] || 0),
            fill: false,
            borderColor: getRandomColor(),
            tension: 0.1,
          };
        });

        setChartData({
          labels: years,
          datasets,
        });
      } catch (error) {
        console.error('Error fetching funding data:', error);
      }
    };

    fetchFundingData();
  }, []);

  // Helper function to generate random colors
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <div>
      <h1>Funding Trends by Industry</h1>
      {chartData ? (
        <Line
          data={chartData}
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