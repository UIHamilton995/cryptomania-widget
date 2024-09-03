import React, { useEffect, useState } from 'react';
import { Table } from 'reactstrap';
import axios from 'axios';
import './App.css';

function App() {
  const [cryptoData, setCryptoData] = useState([]);
  const [btcAmount, setBtcAmount] = useState('--');
  const [usdAmount, setUsdAmount] = useState('--');
  const [btcToUsdRate, setBtcToUsdRate] = useState(null);
  const [lastUpdated, setLastUpdated] = useState('--');

  // Fetch cryptocurrency data and BTC to USD exchange rate
  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const res = await axios.get(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d&locale=en`
        );
        setCryptoData(res.data.slice(0, 5)); // Display the first 5 coins

        // Extract the BTC to USD rate and the last updated time
        const btcData = res.data.find((coin) => coin.id === 'bitcoin');
        if (btcData) {
          setBtcToUsdRate(btcData.current_price);
          setLastUpdated(new Date(btcData.last_updated).toLocaleString());
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchCryptoData();
  }, []);

  // Handle BTC to USD conversion
  const handleBtcChange = (e) => {
    const btc = e.target.value;
    setBtcAmount(btc);
    if (btcToUsdRate && btc !== '' && !isNaN(btc)) {
      setUsdAmount((btc * btcToUsdRate).toFixed(2)); // Convert BTC to USD
    } else {
      setUsdAmount('--');
    }
  };

  // Handle USD to BTC conversion with validation
  const handleUsdChange = (e) => {
    const usd = e.target.value;
    if (usd === '' || isNaN(usd) || usd > 100000000) {
      setUsdAmount(usd); // Update the USD value even if it's invalid
      setBtcAmount('--'); // Reset BTC amount if input is invalid
      return;
    }

    setUsdAmount(usd);
    if (btcToUsdRate) {
      setBtcAmount((usd / btcToUsdRate).toFixed(8)); // Convert USD to BTC
    }
  };

  // Helper function to apply the correct class based on the value
  const getColorClass = (value) => {
    return value >= 0 ? 'positive' : 'negative';
  };

  return (
    <div className='bgImage'>
      <h1 className='converter'><span className='color'>₿  </span>CRYPTOMANIA - WIDGET 💰</h1>
      <div className="d-flex flex-column mt-4 mx-2 border rounded">    

        {/* BTC-USD Converter */}
        <div className='blurred-display'>
          <div className='converter-container'>
            <h3>BTC - USD Converter</h3>
            {btcToUsdRate ? (
              <div>
                <div className='input-group'>
                  <label>BTC:</label>
                  <input
                    type='number'
                    value={btcAmount}
                    onChange={handleBtcChange}
                    placeholder='Enter BTC amount'
                    min="0"
                    step="0.00000001"
                  />
                </div>

                <div className='input-group'>
                  <label>USD:</label>
                  <input
                    type='number'
                    value={usdAmount}
                    onChange={handleUsdChange}
                    placeholder='Enter USD amount'
                    min="0"
                    max="100000000"
                    step="0.01"
                  />
                </div>

                <p>Current BTC to USD Rate: ${btcToUsdRate}</p>
                <p>Last Updated: {lastUpdated}</p>
              </div>
            ) : (
              <p>Loading exchange rate...</p>
            )}
          </div>
        </div>

        {/* Cryptocurrency Table for the Coins */}
        <div className='blurred-display'>
          <h2 className='other-prices'>Bitcoin and Other NGU Tokens</h2>
          {cryptoData.length > 0 ? (
            <Table hover responsive className='crypto-table'>
              <thead className="thead-dark">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>1H</th>
                </tr>
              </thead>
              <tbody>
                {cryptoData.map((coin) => (
                  <tr key={coin.id} className="text-center">
                    <td>{coin.market_cap_rank}</td>
                    <td>
                      <img className='iconSize' src={coin.image} alt={coin.name} />
                      <span>{coin.symbol.toUpperCase()}</span>
                    </td>
                    <td>
                      <span className='price'>
                        {new Intl.NumberFormat("en-IN", {
                          currency: 'usd',
                          style: 'currency',
                        }).format(coin.current_price)}
                      </span>
                    </td>
                    <td>
                      <span className={getColorClass(coin.price_change_percentage_1h_in_currency)}>
                        {Number((coin.price_change_percentage_1h_in_currency || 0).toFixed(2))}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>Loading cryptocurrency data...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;