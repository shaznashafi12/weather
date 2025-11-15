import React, { useState } from 'react'
import axios from 'axios'
import { TiWeatherPartlySunny } from 'react-icons/ti'
import { VscCompass } from 'react-icons/vsc'
import { FaWater, FaTemperatureHigh } from 'react-icons/fa'
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
  const [data, setdata] = useState(null)
  const [hourlyData, setHourlyData] = useState([])
  const [search, setsearch] = useState('')
  const [forecast, setForecast] = useState([])

  const handlechange = (e) => setsearch(e.target.value)

  const handlesubmit = async (e) => {
    e.preventDefault()
    try {
      const API = '0cf3d05c6cb443424f42856d18e090b3' // replace with your key if needed
      const resp = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${search}&units=metric&appid=${API}`
      )
      setdata(resp.data)

      const f = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${search}&units=metric&appid=${API}`
      )

      const hourly = f.data.list.slice(0, 12).map((item) => ({
        time: new Date(item.dt * 1000).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        temp: Math.round(item.main.temp),
      }))
      setHourlyData(hourly)

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
      console.error(err)
      alert('Could not fetch weather. Check city name or API key in component.')
    }
  }

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-start px-6 py-8"
      style={{
        backgroundImage: `url(${img})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <h1 className="flex items-center gap-4 font-bold mt-10 text-5xl text-yellow-600"> <TiWeatherPartlySunny className="w-14 h-14 text-yellow-600" /> WEATHER </h1>
     
       <form
        onSubmit={handlesubmit}
        className="mt-2 mb-10 flex gap-3  bg-white/10 p-3 rounded-2xl backdrop-blur-lg"
      >
        <input
          type="text"
          value={search}
          onChange={handlechange}
          className="text-center text-lg text-white  bg-white/10 placeholder-gray-300 rounded-xl h-[50px] w-[350px] focus:outline-none border border-white/20"
          placeholder="Search city..."
        />
        <button
          type="submit"
          className="w-[120px] h-[50px] bg-yellow-600 hover:opacity-90 active:scale-95 transition text-white rounded-xl text-lg font-semibold shadow-xl"
        >
          Search
        </button>
      </form>

      {data && data.main && (
        <main className="w-full max-w-[1200px] bg-black/50 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10">
          <div className="flex gap-6 items-start">
            <section className="flex-1 text-white pl-6">
              <div className="flex items-start gap-6">
                <div className="text-left">
                  <div className="text-[96px] font-extrabold leading-none">
                    {Math.round(data.main.temp)}
                    <span className="text-3xl font-medium ml-2">°C</span>
                  </div>
                  <div className="text-2xl text-white/90 mt-2 font-light capitalize">
                    {data.weather?.[0]?.description}
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-white/80">
                    <div className="flex items-center gap-3">
                      <img src={humidityImg} alt="hum" className="w-7" />
                      <div>
                        <div className="text-xs text-white/70">Humidity</div>
                        <div className="font-medium text-lg">{data.main.humidity}%</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <VscCompass className="w-6 h-6" />
                      <div>
                        <div className="text-xs text-white/70">Pressure</div>
                        <div className="font-medium text-lg">{data.main.pressure} hPa</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <FaWater className="w-6 h-6 text-blue-300" />
                      <div>
                        <div className="text-xs text-white/70">Sea level</div>
                        <div className="font-medium text-lg">{data.main.sea_level ? `${data.main.sea_level} m` : 'N/A'}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <WiNightCloudyWindy className="w-6 h-6" />
                      <div>
                        <div className="text-xs text-white/70">Wind</div>
                        <div className="font-medium text-lg">{data.wind?.speed} m/s</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="ml-auto text-right pr-6">
                  <div className="text-sm text-white/70">{new Date().toLocaleDateString()}</div>
                  <div className="text-3xl font-semibold mt-2">{data.name}</div>
                </div>
              </div>
            </section>

           

            <aside className="w-72 bg-gradient-to-b from-white/5 to-white/3 rounded-2xl p-4 border border-white/8 shadow-md text-white/90">
              <h4 className="text-lg font-semibold mb-4">Weekly</h4>
              <div className="flex flex-col gap-3">
                {forecast.length > 0 ? (
                  forecast.map((f, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="text-sm text-white/80">{f.day}</div>
                      <div className="text-sm font-semibold">{f.temp}°</div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-white/60">No forecast yet — search a city.</div>
                )}
              </div>

              <div className="mt-6 text-sm text-white/60">Feels like <span className="font-medium text-white/90">{Math.round(data.main.feels_like)}°C</span></div>
            </aside>
          </div>

          <div className="mt-8">
            <div className="w-full bg-black/40 rounded-2xl p-4 border border-white/6">
              <h5 className="text-white/90 mb-2 font-semibold">Next hours</h5>
              <div className="w-full h-44">
                {hourlyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={hourlyData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                      <XAxis dataKey="time" stroke="#ddd" />
                      <YAxis stroke="#ddd" domain={[data => Math.min(...hourlyData.map(h=>h.temp))-3, data => Math.max(...hourlyData.map(h=>h.temp))+3]} />
                      <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.8)', border: 'none', color: '#fff' }} labelStyle={{ color: '#fff' }} />
                      <Line type="monotone" dataKey="temp" stroke="#f6c84c" strokeWidth={3} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-white/60">No hourly data</div>
                )}
              </div>
            </div>
          </div>
        </main>
      )}

     
    </div>
  )
}


