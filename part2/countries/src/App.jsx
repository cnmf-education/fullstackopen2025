//APP.JSX

import { useState, useEffect } from 'react'
import axios from 'axios'


const countriesHttp = 'https://studies.cs.helsinki.fi/restcountries/api/all'


const App = () => {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState('');


  //fetch data about ALL countries from server
  useEffect (() => {
    axios
      .get(countriesHttp)
      .then(response => setCountries(response.data))
  },[])//run once

  //filter logic
  const filtered = countries.filter( country =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  ) 



  return (
    <>
      {/* search bar */}
      <div>
        find countries:           
        <input 
          value={filter} 
          onChange={event => setFilter(event.target.value)}  
        />
      </div>

      {/* warns when, filter has data and filter.length is >10 */}
      {filter && filtered.length>10 && (
        <p>Too many matches, specify another filter</p>
      )}

      {/* show list, when filter.length >=10 and >1  */}
      {filtered.length<=10 && filtered.length>1 && (
        <ul>
          {filtered.map(country=>
            <li key={country.cca3}>
              {country.name.common}
              <button onClick={()=>setFilter(country.name.common)}>Show</button>
            </li>
          )}
        </ul>
      )}
     
      {/* check if filter.length is 1 and display details of country */}
      {filtered.length===1 && (
       <CountryDetails country={filtered[0]}/>
      )}
    </>
  )
}

// Component for Country Details
const CountryDetails = ({country}) => {
  const [weather, setWeather] = useState(null);
  //get the api key
  const api_key = import.meta.env.VITE_WEATHER_KEY

  useEffect(() =>{
    const capital = country?.capital?.[0]
    const latitude = country?.capitalInfo?.latlng?.[0]
    const longitude = country?.capitalInfo?.latlng?.[1]

    // stop if Capital or Location is missing
    if (!capital || !latitude || !longitude) return

    axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${api_key}`
    )
      .then (response => setWeather(response.data)  )
      .catch(error => console.error(error))
  }, [country]) // run only when new counttry is chosen

  return (
    <div>
      {/* Country */}
      <h2>{country.name.common}</h2>
      <p>capital: {country.capital?.[0]}</p>
      <p>area: {country.area} km {'\u00b2'}</p>

      {/* Languages */}
      <h3>Languages</h3>
      
      {country.languages && (
        <ul>
          {Object.values(country.languages).map(language => 
            <li key={language}>{language}</li>
          )}
        </ul>          
      )}        
      

       {/* Flag */}
      <img 
        src={country.flags.png}          
        alt={country.flags.alt || `Flag of ${country.name.common}`}
        width="150" 
      />

      {/* Weather */}
      {weather && (
        <>
          <h3>Weather in {country.capital?.[0]} </h3>
          <p>Temperature : {weather.main.temp} {'\u00b0'} C </p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
          />
          <p>{weather.weather[0].description}</p>
          <p> Wind: {weather.wind.speed} m/s </p>
        </>
      )}

    </div>    
  )
}

export default App
