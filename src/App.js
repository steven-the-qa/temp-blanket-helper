import { useEffect, useState } from 'react'
import axios from 'axios'
import { format } from 'date-fns'

function App() {
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

    return axios.request(options)
      .then(function (response) {
        const station = response.data.data[0];
        return station.id
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  async function getWeather() {
    const weatherStation = await getWeatherStation()
    const options = {
      method: 'GET',
      url: 'https://meteostat.p.rapidapi.com/stations/daily',
      params: {station: weatherStation, start: start, end: end},
      headers: {
        'X-RapidAPI-Key': api_key,
        'X-RapidAPI-Host': host
      }
    };

    return axios.request(options).then(function (response) {
      return response.data.data
    }).catch(function (error) {
      console.error(error);
    });
  }

  function celsiusToFahrenheit(tempC) {
    return Math.round(tempC * 1.8 + 32)
  }

  async function getAvgTemp() {
    const lastWeekDailyTemps = await getWeather()
    let sum = 0;
    for (let i in lastWeekDailyTemps) {
      sum += lastWeekDailyTemps[i].tavg
    }
    // We should only run this for a list of 7 daily temps
    setLastWeekAvg(celsiusToFahrenheit(sum / 7))
  }

  function camelToTitle(camelCaseText) {
    if (typeof camelCaseText === 'string') {
      const colorName = camelCaseText.replace(/text-/, '')
      const result = colorName.replace(/([A-Z])/g, " $1");
      const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
  
      return finalResult
    }
    return camelCaseText
  }

  useEffect(() => {
    if (typeof lastWeekAvg === 'number') {
      if (lastWeekAvg <= 14) {
        setLastWeekColor('text-amethyst')
      }
      else if (lastWeekAvg >= 15 && lastWeekAvg <= 24) {
        setLastWeekColor('text-sapphire')
      }
      else if (lastWeekAvg >= 25 && lastWeekAvg <= 34) {
        setLastWeekColor('text-brightSkyBlue')
      }
      else if (lastWeekAvg >= 35 && lastWeekAvg <= 44) {
        setLastWeekColor('text-deepForest')
      }
      else if (lastWeekAvg >= 45 && lastWeekAvg <= 54) {
        setLastWeekColor('text-fern')
      }
      else if (lastWeekAvg >= 55 && lastWeekAvg <= 64) {
        setLastWeekColor('text-gold')
      }
      else if (lastWeekAvg >= 65 && lastWeekAvg <= 74) {
        setLastWeekColor('text-pumpkin')
      }
      else if (lastWeekAvg >= 75 && lastWeekAvg <= 84) {
        setLastWeekColor('text-cherry')
      }
      else if (lastWeekAvg >= 85) {
        setLastWeekColor('text-burgundy')
      }
    }
  }, [lastWeekAvg])

  return (
    <main className='h-[100vh] flex flex-col justify-center items-center text-white bg-black'>
      <section className='flex flex-col items-center justify-between w-[50%] min-h-[420px] min-w-[340px] h-[50%] border p-5 bg-black p-5 rounded-xl'>
        <h1 className={`${lastWeekColor ?? 'text-white'} text-[6rem]`}>{lastWeekAvg}&#8457;</h1>
        <p className='font-semibold tracking-wider'>{camelToTitle(lastWeekColor) ?? "Click Update for last week's weather"}</p>
        <button className='w-[50%] border border-white rounded-xl p-5 hover:bg-white hover:text-black' onClick={getAvgTemp}>Update</button>
      </section>
    </main>
  )
}

export default App;
