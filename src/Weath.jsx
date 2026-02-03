import React, { useState } from 'react'
import axios from 'axios'
import { TiWeatherPartlySunny } from 'react-icons/ti'
import { VscCompass } from 'react-icons/vsc'
import { FaWater } from 'react-icons/fa'
import { WiNightCloudyWindy } from 'react-icons/wi'
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import humidityImg from './images/humidity.png'
import img from './images/sky4.jpeg'

export default function Weath() {
  const [data, setData] = useState(null)
  const [hourlyData, setHourlyData] = useState([])
  const [search, setSearch] = useState('')
  const [forecast, setForecast] = useState([])

  const handleChange = (e) => setSearch(e.target.value)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const API = '0cf3d05c6cb443424f42856d18e090b3' // Your OpenWeatherMap API key
    const city = encodeURIComponent(search) // Encode city name for URL

    try {
      // Current weather
      const resp = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API}`
      )
      setData(resp.data)

      // Forecast
      const f = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API}`
      )

      // Hourly data for next 12 intervals
      const hourly = f.data.list.slice(0, 12).map((item) => ({
        time: new Date(item.dt * 1000).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        temp: Math.round(item.main.temp),
      }))
      setHourlyData(hourly)

      // Daily forecast
      const days = {}
      f.data.list.forEach((it) => {
        const day = new Date(it.dt * 1000).toLocaleDateString(undefined, {
          weekday: 'short',
        })
        if (!days[day]) days[day] = []
        days[day].push(it.main.temp)
      })
      const dayForecast = Object.keys(days).slice(0, 6).map((d) => ({
        day: d,
        temp: Math.round(
          days[d].reduce((a, b) => a + b, 0) / days[d].length
        ),
      }))
      setForecast(dayForecast)
    } catch (err) {
      console.error(err.response?.data || err)
      alert('Could not fetch weather. Check city name or API key.')
    }
  }

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-start px-3 py-4 sm:px-4 sm:py-6"
      style={{
        backgroundImage: `url(${img})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Header */}
      <h1 className="flex items-center gap-1 sm:gap-2 font-bold mt-4 text-2xl sm:text-3xl text-yellow-600">
        <TiWeatherPartlySunny className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600" /> WEATHER
      </h1>

      {/* Search Form */}
      <form
        onSubmit={handleSubmit}
        className="mt-2 mb-4 sm:mb-6 flex flex-col sm:flex-row gap-1 bg-white/10 p-1 rounded-md backdrop-blur-md w-full max-w-[320px] mx-auto"
      >
        <input
          type="text"
          value={search}
          onChange={handleChange}
          className="text-center text-[10px] sm:text-xs text-white bg-white/10 placeholder-gray-300 rounded-md h-6 sm:h-8 w-full focus:outline-none border border-white/20 px-2"
          placeholder="Search city..."
        />
        <button
          type="submit"
          className="mt-1 sm:mt-0 w-full sm:w-20 h-6 sm:h-8 bg-yellow-600 hover:opacity-90 active:scale-95 transition text-white rounded-md text-[10px] sm:text-xs font-semibold shadow"
        >
          Search
        </button>
      </form>

      {/* Weather Data */}
      {data && data.main && (
        <main className="w-full max-w-[900px] bg-black/50 backdrop-blur-lg rounded-xl p-3 sm:p-4 shadow-md border border-white/10 flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 w-full">
            {/* Main Info */}
            <section className="flex-1 text-white pl-1 sm:pl-2">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2 sm:gap-4">
                <div className="text-left flex-1">
                  <div className="text-4xl sm:text-5xl font-extrabold leading-none">
                    {Math.round(data.main.temp)}
                    <span className="text-lg sm:text-xl font-medium ml-1">°C</span>
                  </div>
                  <div className="text-sm sm:text-base text-white/90 mt-1 font-light capitalize">
                    {data.weather?.[0]?.description}
                  </div>

                  {/* Small Info Grid */}
                  <div className="mt-2 sm:mt-3 grid grid-cols-2 gap-1 sm:gap-2 text-xs sm:text-sm text-white/80">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <img src={humidityImg} alt="hum" className="w-4 sm:w-5" />
                      <div>
                        <div className="text-xs text-white/70">Humidity</div>
                        <div className="font-medium text-xs sm:text-sm">{data.main.humidity}%</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-2">
                      <VscCompass className="w-3 sm:w-4 h-3 sm:h-4" />
                      <div>
                        <div className="text-xs text-white/70">Pressure</div>
                        <div className="font-medium text-xs sm:text-sm">{data.main.pressure} hPa</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-2">
                      <FaWater className="w-3 sm:w-4 h-3 sm:h-4 text-blue-300" />
                      <div>
                        <div className="text-xs text-white/70">Sea level</div>
                        <div className="font-medium text-xs sm:text-sm">{data.main.sea_level ? `${data.main.sea_level} m` : 'N/A'}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-2">
                      <WiNightCloudyWindy className="w-3 sm:w-4 h-3 sm:h-4" />
                      <div>
                        <div className="text-xs text-white/70">Wind</div>
                        <div className="font-medium text-xs sm:text-sm">{data.wind?.speed} m/s</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* City & Date */}
                <div className="ml-auto text-right pr-1 sm:pr-2 mt-1 lg:mt-0">
                  <div className="text-xs sm:text-sm text-white/70 -mt-9">{new Date().toLocaleDateString()}</div>
                  <div className="text-lg sm:text-xl -mt-15 font-semibold ">{data.name}</div>
                </div>
              </div>
            </section>

            {/* Weekly Forecast */}
            <aside className="w-full lg:w-56 bg-gradient-to-b from-white/5 to-white/3 rounded-lg p-2 sm:p-3 border border-white/8 shadow text-white/90 mt-3 lg:mt-0">
              <h4 className="text-sm sm:text-base font-semibold mb-1 sm:mb-2">Weekly</h4>
              <div className="flex flex-col gap-1">
                {forecast.length > 0 ? (
                  forecast.map((f, i) => (
                    <div key={i} className="flex items-center justify-between text-xs sm:text-sm">
                      <div className="text-white/80">{f.day}</div>
                      <div className="font-semibold">{f.temp}°</div>
                    </div>
                  ))
                ) : (
                  <div className="text-white/60 text-xs sm:text-sm">No forecast yet — search a city.</div>
                )}
              </div>

              <div className="mt-2 text-xs sm:text-sm text-white/60">
                Feels like <span className="font-medium text-white/90">{Math.round(data.main.feels_like)}°C</span>
              </div>
            </aside>
          </div>

          {/* Hourly Chart */}
          <div className="mt-3 sm:mt-4 w-full">
            <div className="w-full bg-black/40 rounded-lg p-2 sm:p-3 border border-white/6">
              <h5 className="text-white/90 mb-1 font-semibold text-xs sm:text-sm">Next hours</h5>
              <div className="w-full h-32 sm:h-36 md:h-40">
                {hourlyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={hourlyData} margin={{ top: 0, right: 10, left: -15, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                      <XAxis dataKey="time" stroke="#ddd" />
                      <YAxis stroke="#ddd" domain={[data => Math.min(...hourlyData.map(h=>h.temp))-3, data => Math.max(...hourlyData.map(h=>h.temp))+3]} />
                      <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.8)', border: 'none', color: '#fff' }} labelStyle={{ color: '#fff' }} />
                      <Line type="monotone" dataKey="temp" stroke="#f6c84c" strokeWidth={2} dot={{ r: 2 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-white/60 text-xs sm:text-sm">No hourly data</div>
                )}
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  )
}
