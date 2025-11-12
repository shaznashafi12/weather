import axios from "axios";
import React, { useState } from "react";
import img from "./images/sky4.jpeg";
import { TiWeatherPartlySunny } from "react-icons/ti";
import humidityImg from "./images/humidity.png";
import tem from "./images/tmm.png";
import { VscCompass } from "react-icons/vsc";
import { FaWater, FaArrowUp } from "react-icons/fa"; // ✅ Added for Sea Level icon
import { WiNightCloudyWindy } from "react-icons/wi";
import { FaTemperatureHigh } from "react-icons/fa";

import img1 from "./images/wee1.png"
const Weath = () => {
  const [data, setdata] = useState(null);
  const [search, setsearch] = useState("");

  const handlechange = (event) => {
    setsearch(event.target.value);
  };

  const handlesubmit = async (event) => {
    event.preventDefault();
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${search}&units=metric&appid=0cf3d05c6cb443424f42856d18e090b3`
      );
      setdata(response.data);
      
  };

    return (
    <div
      className="w-full h-[120vh] bg-cover bg-center flex flex-col items-center"
      style={{ backgroundImage: `url(${img})` }}
    >
      <h1 className="flex items-center gap-4 font-bold mt-20 text-5xl text-white">
        <TiWeatherPartlySunny className="w-14 h-14 text-yellow-300" />
        WEATHER
      </h1>

      <form onSubmit={handlesubmit} className="mt-10 flex gap-3">
        <input
          type="text"
          value={search}
          onChange={handlechange}
          className="text-center text-lg text-white bg-gray-700/50 placeholder-gray-300 backdrop-blur-md rounded-xl h-[50px] w-[350px] focus:outline-none border border-gray-500"
          placeholder="Search city..."
        />
        <button
          type="submit"
          className="w-[100px] h-[50px] text-1xl font-sans bg-gray-600 hover:bg-gray-900 text-white rounded"
        >
          Search
        </button>
      </form>

      {data && data.main && data.weather && (
        <>

         <div className=" items-center text-white ">
                  <img src={img1} width={200} height={200} className="ml-5 mb-[-50px]" ></img>

  <div className=" flex items-center gap-6">
    <div>
      <h2 className="text-7xl font-serif font-semibold">{data.name}</h2>
      <p className="text-gray-300 text-2xl capitalize font-mono">
        {data.weather?.[0]?.description}
      </p>
    </div>

    <div className="text-6xl font-bold font-mono text-yellow-300 pb-7 ml-5">
      {data.main.temp}°C
    </div>
  </div>
</div>
          <div className="mt-9 bg-black/50 backdrop-blur-lg rounded-3xl text-white w-[1500px] p-8 shadow-2xl">
            <div className="flex justify-center flex-wrap gap-8">
              <div className="bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl h-[600px] w-[250px] p-6 flex flex-col items-center hover:scale-105 transition-transform duration-300">
                <img src={humidityImg} alt="humidity" className="w-[350px] h-[300px] mb-2 mt-10" />
                <p className="text-gray-200 text-4xl font-serif font-bold mt-5">Humidity</p>
                <h3 className="text-3xl font-semibold">{data.main.humidity}%</h3>
              </div>

              <div className="bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl h-[600px] w-[250px] p-6 flex flex-col items-center hover:scale-105 transition-transform duration-300">
<VscCompass className="w-[200px] h-[200px] mt-20"/>

                <p className="text-gray-200 text-4xl font-serif font-bold mt-20">Pressure</p>
                <h3 className="text-3xl font-semibold">{data.main.pressure} hPa</h3>
              </div>
             <div className="bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl h-[600px] w-[250px] p-6 flex flex-col items-center hover:scale-105 transition-transform duration-300">
                <div className="flex items-center gap-3 mt-16">
                  <FaWater className="text-white text-9xl mt-10 ml-2" />
                  <FaArrowUp className="text-white text-6xl mt-10" />
                </div>
                <p className="text-gray-200 text-4xl font-serif font-bold mt-32">
                  Sea Level
                </p>
                <h3 className="text-3xl font-semibold">
                  {data.main.sea_level ? `${data.main.sea_level} m` : "N/A"}
                </h3>
              </div>


              <div className="bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl h-[600px] w-[250px] p-6 flex flex-col items-center hover:scale-105 transition-transform duration-300">
                <WiNightCloudyWindy className="w-[200px] h-[200px] mt-20"/>

                <p className="text-gray-200 text-4xl font-serif font-bold mt-20">Wind</p>
                <h3 className="text-3xl font-semibold">{data.wind?.speed} m/s</h3>
              </div>

              <div className="bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl h-[600px] w-[250px] p-6 flex flex-col items-center hover:scale-105 transition-transform duration-300">
              <FaTemperatureHigh className="w-[180px] h-[200px] mt-20"/>

                <p className="text-gray-200 text-4xl font-serif font-bold mt-20">Feels Like</p>
                <h3 className="text-3xl font-semibold">
                  {Math.round(data.main.feels_like)}°C
                </h3>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Weath;
