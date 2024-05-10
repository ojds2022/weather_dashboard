const userInput = document.getElementById('inputField');
const searchButton = document.getElementById('searchButton');

const genDate = new Date();
const formattedDate = genDate.toLocaleDateString('en-US');

const futureDate1 = () => {
    const genDate = new Date();
    genDate.setDate(genDate.getDate() + 1);
    const month = (genDate.getMonth() + 1).toString().padStart(1); // Get month (adding 1 because month is zero-indexed)
    const day = genDate.getDate().toString().padStart(2, '0'); // Get day
    const year = genDate.getFullYear(); // Get year
    const formattedDate = `${month}/${day}/${year}`;
    return formattedDate;
}
const futureDate2 = () => {
    const genDate = new Date();
    genDate.setDate(genDate.getDate() + 2);
    const month = (genDate.getMonth() + 1).toString().padStart(1); // Get month (adding 1 because month is zero-indexed)
    const day = genDate.getDate().toString().padStart(2, '0'); // Get day
    const year = genDate.getFullYear(); // Get year
    const formattedDate = `${month}/${day}/${year}`;
    return formattedDate;
}
const futureDate3 = () => {
    const genDate = new Date();
    genDate.setDate(genDate.getDate() + 3);
    const month = (genDate.getMonth() + 1).toString().padStart(1); // Get month (adding 1 because month is zero-indexed)
    const day = genDate.getDate().toString().padStart(2, '0'); // Get day
    const year = genDate.getFullYear(); // Get year
    const formattedDate = `${month}/${day}/${year}`;
    return formattedDate;
}

const currentCity = document.getElementById('currentCity');
const currentRegion = document.getElementById('currentRegion');
const currentDate = document.getElementById('currentDate');
const weatherIcon = document.getElementById('weatherIcon');
const temp = document.getElementById('temp');
const wind = document.getElementById('wind');
const humidity = document.getElementById('humidity');

const day1 = document.getElementById('day1');
const day2 = document.getElementById('day2');
const day3 = document.getElementById('day3');

const listOfCitiesSearched = document.getElementById('listOfCitiesSearched');
let arrayOfCities = JSON.parse(localStorage.getItem('arrayOfCities'));

searchButton.addEventListener('click', () => {
    fetchWeatherInfo();
});

function fetchWeatherInfo(previousCitySearched) {
    const city = userInput.value;
    const cachedData = localStorage.getItem(city);

    if (cachedData) {
        // If data is found in cache, parse and use it directly
        const data = JSON.parse(cachedData);
        postWeatherInfo(data);
    } else if (previousCitySearched) {
        const url = `https://weatherapi-com.p.rapidapi.com/forecast.json?q=${previousCitySearched}&days=6`;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '48cbe57e99msh59bbaa3d2989b86p1dd679jsn22273669dbf3',
                'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
            }
        };

        fetch(url, options)
                .then(response => response.json())
                .then(response => {
                    postCitiesSearched(response);
                    postWeatherInfo(response)
                })
                .catch(err => console.error(err));
    } else {
        // If data is not found in cache, fetch it from the API
        const url = `https://weatherapi-com.p.rapidapi.com/forecast.json?q=${city}&days=6`;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '48cbe57e99msh59bbaa3d2989b86p1dd679jsn22273669dbf3',
                'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
            }
        };

        fetch(url, options)
                .then(response => response.json())
                .then(response => {
                    postCitiesSearched(response);
                    postWeatherInfo(response)
                })
                .catch(err => console.error(err));
        }
}

function postCitiesSearched(data) {
    if (!arrayOfCities) {
        arrayOfCities = [];
    }

    arrayOfCities.push(data.location.name);

    let updatedArrayString = JSON.stringify(arrayOfCities);

    localStorage.setItem('arrayOfCities', updatedArrayString);

    const newArray = localStorage.getItem('arrayOfCities');

    const parsedArray = JSON.parse(newArray);

    let buttonsHTML = ''; // Initialize an empty string to store HTML for buttons

    if (parsedArray.length <= 9) {
        for (let i = parsedArray.length - 2; i > -1; i--) {
            buttonsHTML += `<button class='cityBtn'>${parsedArray[i]}</button>`; // Concatenate HTML for each button
        }
    } else {
        for (let i = parsedArray.length - 2; i > parsedArray.length - 10; i--) {
            buttonsHTML += `<button class='cityBtn'>${parsedArray[i]}</button>`; // Concatenate HTML for each button
        }
    }
    
    listOfCitiesSearched.innerHTML = buttonsHTML; // Set the innerHTML after the loop to display all buttons

    const cityBtns = document.getElementsByClassName('cityBtn');
    for (let i = 0; i < cityBtns.length; i++) {
        cityBtns[i].addEventListener('click', (event) => {
            fetchWeatherInfo(event.target.textContent)
        });
    }
}

function postWeatherInfo(data) {
    currentCity.innerHTML = `<h2>${data.location.name},</h2>`;
    currentRegion.innerHTML = `<h2>${data.location.region}</h2>`;
    currentDate.innerHTML = `<h2>(${formattedDate})</h2>`;
    weatherIcon.src = `https:${data.current.condition.icon}`;
    temp.innerHTML = `<p>Temp: ${data.current.temp_f}&deg;F</p>`;
    wind.innerHTML = `<p>Wind: ${data.current.wind_mph} MPH</p>`;
    humidity.innerHTML = `<p>Humidity: ${data.current.humidity}%</p>`;

    day1.innerHTML = `<h3>${futureDate1()}</h3>
                      <img src='https:${data.forecast.forecastday[0].day.condition.icon}' />
                      <p>Temp: ${data.forecast.forecastday[0].day.maxtemp_f}&deg;F</p>
                      <p>Wind: ${data.forecast.forecastday[0].day.maxwind_mph} MPH</p>
                      <p>Humidity: ${data.forecast.forecastday[0].day.avghumidity}%</p>`;
    
    day2.innerHTML = `<h3>${futureDate2()}</h3>
                      <img src='https:${data.forecast.forecastday[1].day.condition.icon}' />
                      <p>Temp: ${data.forecast.forecastday[1].day.maxtemp_f}&deg;F</p>
                      <p>Wind: ${data.forecast.forecastday[1].day.maxwind_mph} MPH</p>
                      <p>Humidity: ${data.forecast.forecastday[1].day.avghumidity}%</p>`;

    day3.innerHTML = `<h3>${futureDate3()}</h3>
                      <img src='https:${data.forecast.forecastday[2].day.condition.icon}' />
                      <p>Temp: ${data.forecast.forecastday[2].day.maxtemp_f}&deg;F</p>
                      <p>Wind: ${data.forecast.forecastday[2].day.maxwind_mph} MPH</p>
                      <p>Humidity: ${data.forecast.forecastday[2].day.avghumidity}%</p>`;
}

// Function to populate weather information on page load
window.addEventListener('load', () => {
    const lastSearchedCity = arrayOfCities[arrayOfCities.length - 1];
    fetchWeatherInfo(lastSearchedCity);
});