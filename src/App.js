import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [weatherStation, setWeatherStation] = useState()
  const [lastWeekWeather, setLastWeekWeather] = useState()

  const location = {
    "lat": 43.170058,
    "lon": -89.263276
  }
  const currentDate = new Date()
  const millsInADay = 86400000
  const yesterday = new Date(currentDate - millsInADay)
  const weekAndADayAgo = new Date(currentDate - (8 * millsInADay))
  
  const api_key = '2fcce1cd8cmshc6e945908329dc5p19917fjsn583f60c82fc6'
  const lat = location.lat
  const lon = location.lon

  const getWeatherStation = () => {
    const url = `https://meteostat.p.rapidapi.com/stations/nearby?rapidapi-key=${api_key}&lat=${lat}&lon=${lon}&limit=1`
    axios.get(url)
      .then(res => {
        const station = res.data
        setWeatherStation(station)
      })
  }

  const start = Date.parse(weekAndADayAgo)
  const end = Date.parse(yesterday)

  const getWeather = () => {
    const url = `https://meteostat.p.rapidapi.com/stations/daily?rapidapi-key=${api_key}&station=${weatherStation}&start=${start}&end=${end}&units=imperial`
    axios.get(url)
      .then(res => {
        const weather = res.data
        setLastWeekWeather(weather)
        console.log(lastWeekWeather)
      })
  }
  const avgTemp = useState(69)
  const color = useState('red')
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Temperature Blanket Helper</h1>
      <main>
        <section>
          <h2>Last Week</h2>
          <p>Average Temperature (F): {avgTemp}</p>
          <p>Color: {color}</p>
          <p>Weather Station: {weatherStation}</p>
          <button onClick={getWeatherStation}>Get weather station</button>
          <button onClick={getWeather}>Get data</button>
        </section>
      </main>
    </div>
  )
}

export default App;
