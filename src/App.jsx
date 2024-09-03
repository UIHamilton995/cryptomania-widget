import React, { useEffect, useState } from 'react'
import { Table } from 'reactstrap'
import axios from 'axios';
import './App.css'

function App() {

  const [cryptoData, setCryptoData] = useState([]);
  const [btcAmount, setBtcAmount] = useState(0);
  const [usdAmount, setUsdAmount] = useState(0);
  const [btcToUsdRate, setBtcToUsdRate] = useState(null);

  // Fetch cryptocurrency data and BTC to USD exchange rate
  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const res = await axios.get(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d&locale=en`
        );
        setCryptoData(res.data);

        // Extract the BTC to USD rate from the first coin in the array
        const btcData = res.data.find(coin => coin.id === 'bitcoin');
        if (btcData) {
          setBtcToUsdRate(btcData.current_price);
        }

        console.log(res.data);
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
    if (btcToUsdRate) {
      setUsdAmount((btc * btcToUsdRate).toFixed(2)); // Convert BTC to USD
    }
  };

  // Handle USD to BTC conversion
  const handleUsdChange = (e) => {
    const usd = e.target.value;
    setUsdAmount(usd);
    if (btcToUsdRate) {
      setBtcAmount((usd / btcToUsdRate).toFixed(8)); // Convert USD to BTC
    }
  };

  // Helper function to apply the correct class based on the value
  const getColorClass = (value) => {
    return value >= 0 ? 'positive' : 'negative'
  }

  return (
    <div className='bgImage'>
      <h1 className='converter'><span className='color'>₿  </span>CRYPTOMANIA - WIDGET 💰</h1>
      <div className='blurred-display'>
      <div className="d-flex flex-column mt-4 mx-5 border rounded">
        <h2 className='other-prices'>Bitcoin Prices and Others</h2>
    {/* Cryptocurrency Table for the First Coin */}
    {cryptoData.length > 0 ? (
        <Table bordered hover responsive className='crypto-table'>
          <thead className="thead-dark">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Price</th>
              <th>1H</th>
            </tr>
          </thead>
          <tbody>
            <tr key={cryptoData[0].id} className="text-center">
              <td>{cryptoData[0].market_cap_rank}</td>
              <td>
                <img className='iconSize' src={cryptoData[0].image} alt={cryptoData[0].name} />
                <span>{cryptoData[0].symbol.toUpperCase()}</span>
              </td>
              <td>
                <span className='price'>
                  {new Intl.NumberFormat("en-IN", {
                    currency: 'usd',
                    style: 'currency',
                  }).format(cryptoData[0].current_price)}
                </span>
              </td>
              <td>
                <span className={getColorClass(cryptoData[0].price_change_percentage_1h_in_currency)}>
                  {Number((cryptoData[0].price_change_percentage_1h_in_currency || 0).toFixed(2))}
                </span>
              </td>
            </tr>
          </tbody>
        </Table>
      ) : (
        <p>Loading cryptocurrency data...</p>
      )}
        </div>
        
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
              />
            </div>

            <div className='input-group'>
              <label>USD:</label>
              <input
                type='number'
                value={usdAmount}
                onChange={handleUsdChange}
                placeholder='Enter USD amount'
              />
            </div>

            <p>Current BTC to USD Rate: ${btcToUsdRate}</p>
          </div>
        ) : (
          <p>Loading exchange rate...</p>
        )}
      </div>
      </div>
      </div>
    </div>
  )
}

export default App


