import { useEffect, useState } from 'react'
import axios from 'axios'
import { format } from 'date-fns'

function App() {
  const [weatherStation, setWeatherStation] = useState()
  const [lastWeekDailyTemps, setLastWeekDailyTemps] = useState()
  const [lastWeekAvg, setLastWeekAvg] = useState('?')
  const [lastWeekColor, setLastWeekColor] = useState()

  const location = {
    "lat": 43.170058,
    "lon": -89.263276
  }

  const currentDate = new Date()
  const millsInADay = 86400000
  const yesterday = new Date(currentDate - millsInADay)
  const weekAndADayAgo = new Date(currentDate - (7 * millsInADay))
  const formatter = 'yyyy-MM-dd'
  const start = format(weekAndADayAgo, formatter)
  const end = format(yesterday, formatter)
  
  const api_key = '2fcce1cd8cmshc6e945908329dc5p19917fjsn583f60c82fc6'
  const host = 'meteostat.p.rapidapi.com'
  const lat = location.lat
  const lon = location.lon

  function getWeatherStation() {
    const options = {
      method: 'GET',
      url: 'https://meteostat.p.rapidapi.com/stations/nearby',
      params: {lat: lat, lon: lon, limit: 1},
      headers: {
        'X-RapidAPI-Key': api_key,
        'X-RapidAPI-Host': host
      }
    };

    axios.request(options)
      .then(function (response) {
        const station = response.data.data[0];
        setWeatherStation(station.id)
        console.log(response)
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  async function getWeather() {
    await getWeatherStation()
    const options = {
      method: 'GET',
      url: 'https://meteostat.p.rapidapi.com/stations/daily',
      params: {station: weatherStation, start: start, end: end},
      headers: {
        'X-RapidAPI-Key': api_key,
        'X-RapidAPI-Host': host
      }
    };

    axios.request(options).then(function (response) {
      setLastWeekDailyTemps(response.data.data)
      console.log(response.data.data)
    }).catch(function (error) {
      console.error(error);
    });
  }

  function celsiusToFahrenheit(tempC) {
    console.log(`${tempC} is the value we pass into celsiusToFahrenheit`)
    return Math.round(tempC * 1.8 + 32)
  }

  async function getAvgTemp() {
    await getWeather()
    let sum = 0;
    console.log(`${lastWeekDailyTemps} is last week's temps`)
    console.log(`${sum} is the initial sum`)
    for (let i in lastWeekDailyTemps) {
      console.log(`${sum} is the round ${i} sum`);
      sum += lastWeekDailyTemps[i].tavg
    }
    console.log(`${sum} is what we convert to Fahrenheit`)
    // We should only run this for a list of 7 daily temps
    setLastWeekAvg(celsiusToFahrenheit(sum / 7))
  }

  function convertFromCamel(camelCaseText) {
    if (typeof camelCaseText === 'string') {
      const result = camelCaseText.replace(/([A-Z])/g, " $1");
      const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
  
      return finalResult
    }
    return camelCaseText
  }

  useEffect(() => {
    if (typeof lastWeekAvg === 'number') {
      if (lastWeekAvg <= 10) {
        setLastWeekColor('purple')
      }
      else if (lastWeekAvg >= 11 && lastWeekAvg <= 20) {
        setLastWeekColor('indigo')
      }
      else if (lastWeekAvg >= 21 && lastWeekAvg <= 30) {
        setLastWeekColor('royalBlue')
      }
      else if (lastWeekAvg >= 31 && lastWeekAvg <= 40) {
        setLastWeekColor('aquamarine')
      }
      else if (lastWeekAvg >= 41 && lastWeekAvg <= 50) {
        setLastWeekColor('darkGreen')
      }
      else if (lastWeekAvg >= 51 && lastWeekAvg <= 60) {
        setLastWeekColor('lightGreen')
      }
      else if (lastWeekAvg >= 61 && lastWeekAvg <= 70) {
        setLastWeekColor('honeyYellow')
      }
      else if (lastWeekAvg >= 71 && lastWeekAvg <= 80) {
        setLastWeekColor('darkOrange')
      }
      else if (lastWeekAvg >= 81 && lastWeekAvg <= 90) {
        setLastWeekColor('orangeRed')
      }
      else if (lastWeekAvg >= 91) {
        setLastWeekColor('red')
      }
    }
  }, [lastWeekAvg])

  const tempTextStyles = lastWeekColor ? { color: lastWeekColor, fontSize: '6rem' } : { color: 'white', fontSize: '6rem' }
  const titleCaseColor = convertFromCamel(lastWeekColor)

  return (
    <main className='h-[100vh] flex flex-col justify-center items-center text-white bg-black'>
      <section className='flex flex-col items-center justify-between w-[50%] min-h-[420px] min-w-[340px] h-[50%] border p-5 bg-black p-5 rounded-xl'>
        <h1 style={tempTextStyles}>{lastWeekAvg}&#8457;</h1>
        <p className='font-semibold tracking-wider'>{titleCaseColor ?? "Click Update for last week's weather"}</p>
        <button className='w-[50%] border border-white rounded-xl p-5 hover:bg-white hover:text-black' onClick={getAvgTemp}>Update</button>
      </section>
    </main>
  )
}

export default App;