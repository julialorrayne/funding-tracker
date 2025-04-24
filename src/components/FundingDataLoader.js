import React, { useState, useEffect } from 'react';

const FundingDataLoader = () => {
  const [fundingData, setFundingData] = useState(null);

  useEffect(() => {
    const fetchFundingData = async () => {
      try {
        const response = await fetch('/funding.json'); // Adjust the path if necessary
        if (!response.ok) {
          throw new Error('Failed to fetch funding data');
        }
        const data = await response.json();
        setFundingData(data);
      } catch (error) {
        console.error('Error fetching funding data:', error);
      }
    };

    fetchFundingData();
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div>
      <h1>Funding Data</h1>
      {fundingData ? (
        <pre>{JSON.stringify(fundingData, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default FundingDataLoader;