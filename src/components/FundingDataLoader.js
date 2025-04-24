import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';

const FundingDataLoader = () => {
  const [fundingData, setFundingData] = useState(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchFundingData = async () => {
      try {
        const response = await fetch('/funding.json'); // Adjust the path if necessary
        if (!response.ok) {
          throw new Error('Failed to fetch funding data');
        }
        const data = await response.json();
        setFundingData(data);

        // Calculate total funding per year
        const fundingByYear = data.reduce((acc, item) => {
          acc[item.year] = (acc[item.year] || 0) + item.amount;
          return acc;
        }, {});

        // Prepare data for the chart
        const years = Object.keys(fundingByYear).sort();
        const totals = years.map(year => fundingByYear[year]);

        setChartData({
          labels: years,
          datasets: [
            {
              label: 'Total Funding ($)',
              data: totals,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching funding data:', error);
      }
    };

    fetchFundingData();
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div>
      <h1>Funding Data</h1>
      {chartData ? (
        <Bar
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
                  text: 'Total Funding ($)',
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