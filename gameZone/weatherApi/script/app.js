const container = document.querySelector('.container');
const searchInput = document.querySelector('.search-input');
const searchButton = document.querySelector('.search-btn');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');
const suggestionsContainer = document.getElementById('suggestions-container');
const cityButtons = document.querySelectorAll('.city-button');

const APIKey = 'e4c2b121defd0eb70dddd90d67acad43';


const weatherImages = {
    'Clear': 'images/01 Sunny COLOR.gif',
    'Clouds': {
        'few clouds': 'images/02 Partly Cloudy COLOR.gif',
        'scattered clouds': 'images/03 Partly Sunny COLOR.gif',
        'broken clouds': 'images/04 Cloudy COLOR.gif',
        'overcast clouds': 'images/04 Cloudy COLOR.gif',
    },
    'Drizzle': 'images/05 Drizzle COLOR.gif',
    'Rain': {
        'light rain': 'images/06 Rain COLOR.gif',
        'moderate rain': 'images/06 Rain COLOR.gif',
        'heavy intensity rain': 'images/06 Rain COLOR.gif',
        'very heavy rain': 'images/06 Rain COLOR.gif',
        'extreme rain': 'images/06 Rain COLOR.gif',
        'freezing rain': 'images/06 Rain COLOR.gif',
        'light intensity shower rain': 'images/06 Rain COLOR.gif',
        'shower rain': 'images/06 Rain COLOR.gif',
        'heavy intensity shower rain': 'images/06 Rain COLOR.gif',
        'ragged shower rain': 'images/06 Rain COLOR.gif',
    },
    'Thunderstorm': 'images/17 Storm COLOR.gif',
    'Snow': {
        'light snow': 'images/07 Snowy COLOR.gif',
        'snow': 'images/10 Snowy Sunny COLOR.gif',
        'heavy snow': 'images/16 Snowy Night COLOR.gif',
        'sleet': 'images/05 Drizzle COLOR.gif',
        'light shower sleet': 'images/05 Drizzle COLOR.gif',
        'shower sleet': 'images/05 Drizzle COLOR.gif',
        'light rain and snow': 'images/06 Rain COLOR.gif',
        'rain and snow': 'images/06 Rain COLOR.gif',
        'light shower snow': 'images/07 Snowy COLOR.gif',
        'shower snow': 'images/07 Snowy COLOR.gif',
        'heavy shower snow': 'images/07 Snowy COLOR.gif',
    },
    'Mist': 'images/21 Mist COLOR.gif',
    'Smoke': 'images/21 Mist COLOR.gif',
    'Haze': 'images/21 Mist COLOR.gif',
    'Dust': 'images/21 Mist COLOR.gif',
    'Fog': 'images/21 Mist COLOR.gif',
    'Sand': 'images/21 Mist COLOR.gif',
    'Ash': 'images/21 Mist COLOR.gif',
    'Squall': 'images/18 Windy COLOR.gif',
    'Tornado': 'images/20 Tornado COLOR.gif',
};

const cities = [
    { name: "Paris, France", code: "Paris" },
    { name: "Bangkok, Thailand", code: "Bangkok" },
    { name: "London, UK", code: "London" },
    { name: "Dubai, UAE", code: "Dubai" },
    { name: "Singapore, Singapore", code: "Singapore" },
    { name: "Kuala Lumpur, Malaysia", code: "Kuala Lumpur" },
    { name: "Istanbul, Turkey", code: "Istanbul" },
    { name: "New York, USA", code: "New York" },
    { name: "Tokyo, Japan", code: "Tokyo" },
    { name: "Rome, Italy", code: "Rome" }
];


function getWeather(city) {
    if (!city) return;

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
        .then(response => response.json())
        .then(json => {
            if (json.cod === '404') {
                container.style.height = '400px';
                weatherBox.style.display = 'none';
                weatherDetails.style.display = 'none';
                error404.style.display = 'block';
                error404.classList.add('fadeIn');
                return;
            }

            error404.style.display = 'none';
            error404.classList.remove('fadeIn');
            const city = document.querySelector('.cityName');
            const image = document.querySelector('.weather-icon');
            const temperature = document.querySelector('.temperature');
            const description = document.querySelector('.description');
            const humidity = document.querySelector('.humidity span');
            const wind = document.querySelector('.wind span');

            const weatherMain = json.weather[0].main;
            const weatherDescription = json.weather[0].description.toLowerCase();


            if (typeof weatherImages[weatherMain] === 'string') {
                image.src = weatherImages[weatherMain];
            } else if (weatherImages[weatherMain] && weatherImages[weatherMain][weatherDescription]) {
                image.src = weatherImages[weatherMain][weatherDescription];
            } else {
                image.src = 'images/default.gif';
            }
            city.innerHTML = `${json.name}`
            temperature.innerHTML = `${Math.round(json.main.temp)}<span>°C</span>`;
            description.innerHTML = json.weather[0].description;
            humidity.innerHTML = `${json.main.humidity}%`;
            wind.innerHTML = `${Math.round(json.wind.speed)} Km/h`;

            weatherBox.style.display = 'block';
            weatherDetails.style.display = 'block';
            weatherBox.classList.add('fadeIn');
            weatherDetails.classList.add('fadeIn');
            container.style.height = '590px';
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}


searchButton.addEventListener('click', () => {
    const city = searchInput.value.trim();
    getWeather(city);
});


cityButtons.forEach(button => {
    button.addEventListener('click', () => {
        const city = button.getAttribute('data-city');
        getWeather(city);
    });
});

searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    if (query.length < 2) {
        suggestionsContainer.innerHTML = '';
        suggestionsContainer.style.display = 'none';
        return;
    }

    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${APIKey}`)
        .then(response => response.json())
        .then(data => {
            suggestionsContainer.innerHTML = '';
            if (data.length > 0) {
                suggestionsContainer.style.display = 'block';
                data.forEach(city => {
                    if (city.name.toLowerCase().includes(query)) {
                        const suggestion = document.createElement('div');
                        suggestion.textContent = `${city.name}, ${city.country}`;
                        suggestion.addEventListener('click', () => {
                            searchInput.value = city.name;
                            suggestionsContainer.innerHTML = '';
                            suggestionsContainer.style.display = 'none';
                            getWeather(city.name);
                        });
                        suggestionsContainer.appendChild(suggestion);
                    }
                });
            } else {
                suggestionsContainer.style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Error fetching city suggestions:', error);
        });
});


function updateRSSBar() {
    const rssContent = document.querySelector('.rss-content');
    rssContent.innerHTML = '';

    cities.forEach((city, index) => {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city.code}&units=metric&appid=${APIKey}`)
            .then(response => response.json())
            .then(data => {
                const weatherMain = data.weather[0].main;
                const temperature = Math.round(data.main.temp);
                const weatherIcon = getWeatherIcon(weatherMain);

                const spanElement = document.createElement('span');
                spanElement.innerHTML = `<img src="${weatherIcon}" alt="${weatherMain} Icon"> ${city.name} | ${temperature}°C`;

                rssContent.appendChild(spanElement);

                if (index < cities.length - 1) {
                    const separator = document.createElement('span');
                    separator.textContent = '|';
                    rssContent.appendChild(separator);
                }
            })
            .catch(error => console.error('Error fetching weather data:', error));
    });
}

function getWeatherIcon(weather) {

    const weatherIcons = {
        'Clear': 'images/01 Sunny COLOR.gif',
        'Clouds': 'images/04 Cloudy COLOR.gif',
        'Drizzle': 'images/05 Drizzle COLOR.gif',
        'Rain': 'images/06 Rain COLOR.gif',
        'Thunderstorm': 'images/17 Storm COLOR.gif',
        'Snow': 'images/10 Snowy Sunny COLOR.gif',
        'Mist': 'images/21 Mist COLOR.gif'
    };
    return weatherIcons[weather] || 'images/default.gif';
}

updateRSSBar();

document.querySelectorAll('.rss-content span').forEach(city => {
    city.addEventListener('click', () => {
        const cityName = city.textContent.split(',')[0].trim();
        getWeather(cityName);
    });
});


document.addEventListener('click', (event) => {
    if (!suggestionsContainer.contains(event.target) && event.target !== searchInput) {
        suggestionsContainer.style.display = 'none';
    }
});