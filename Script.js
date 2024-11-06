// For Seeing The Weather Info  :
const TempActuel = document.getElementById("degree");
const CurrentCity = document.getElementById("City-name")
const CountryName = document.getElementById("Country-name");
const WeatherIcon = document.getElementById("svg-current");
const DateTime =document.getElementById("current-datetime");

//For Input of Data :
const InputSearch = document.getElementById("input");
const SearchButton = document.getElementById("search-btn");

//For Seeing The Result Of Fetching  Data :
const  StatusWeather = document.getElementById("status");
const TempMax = document.getElementById("max-temp");
const TempMin = document.getElementById("min-temp");
const Humidite = document.getElementById("humidity");
const WindSpeed = document.getElementById("wind");

//For Daily Forecast 7 days:
const statusIcon  = document.getElementById("svg-status");
const day = document.getElementsByClassName("time-2");
const statusDay = document.getElementsByClassName("status-2");
const  tempDay = document.getElementsByClassName("temp-2");
const apiKey = "63ecda3991a630514317f9d5dee95f84";


SearchButton.addEventListener('click', () => {
    const city = InputSearch.value;
    if (city) {
        getWeatherData(city);
    } else {
        alert('Please enter a city name.');
    }
});

async function getWeatherData(city) {
    
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        if (!response.ok) {
            throw new Error('City not found');
        }
        const data = await response.json();
        updateCurrentWeatherUI(data);

        const countryName = await getCountryName(data.sys.country);
        console.log('Country:', countryName);

        const CountryName = document.getElementById("Country-name");
        if (CountryName) {
            CountryName.textContent = countryName;
        }

        const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&exclude=hourly,minutely&appid=${apiKey}&units=metric`);
        const forecastData = await forecastResponse.json();
        updateForecastUI(forecastData);

        updateCurrentDate(data);

    
}

async function getCountryName(countryCode) {
    try {
        const response = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`);
        const countryData = await response.json();
        return countryData[0].name.common;
    } catch (error) {
        console.error('Error fetching country name:', error);
        return countryCode;
    }
}

function updateCurrentWeatherUI(data) {
    const { main, weather, wind, sys } = data;

    TempActuel.textContent = `${Math.round(main.temp)}°`;
    CurrentCity.textContent = data.name;
    CountryName.textContent = sys.country;
    StatusWeather.innerHTML = `<h4>${weather[0].description}</h4>`;
    TempMax.textContent = `${Math.round(main.temp_max)}°`;
    TempMin.textContent = `${Math.round(main.temp_min)}°`;
    Humidite.textContent = `${main.humidity}%`;
    WindSpeed.textContent = `${Math.round(wind.speed)} km/h`;

    const cityTime = new Date((data.dt + data.timezone) * 1000);
    const options = { hour: '2-digit', minute: '2-digit', weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    DateTime.textContent = cityTime.toLocaleString('en-US', options);
}

function updateForecastUI(forecastData) {
    for (let i = 0; i < 7; i++) {
        if (i < statusDay.length) {
            const daily = forecastData.daily[i];
            day[i].textContent = new Date(daily.dt * 1000).toLocaleDateString('en-US', { day: 'numeric', month: 'numeric' });
            statusDay[i].textContent = daily.weather[0].description;
            tempDay[i].textContent = `${Math.round(daily.temp.day)}°`;
        }
    }
}



