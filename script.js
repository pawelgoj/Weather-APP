let file = "key.env";

fetch(file)
    .then(file => file.text())
    .then(key => { key = key.replace('API_KEY=', '');

const apiKey = `&appid=${key}`;

//Api links 
const apiLink = 'https://api.openweathermap.org/data/2.5/weather?';
const parameterForCityName = 'q=';
const units ='&units=metric';



const input = document.querySelector('input');
const btn = document.querySelector('.button1');
const country = document.querySelector('.country');
const cityName = document.querySelector('.city-name');
const warning = document.querySelector('.warning');
const picture = document.querySelector('.picture');
const clock = document.querySelector('.clock');
const wrapper = document.querySelector('.wrapper');

const weather = document.querySelector('.weather');
const temperature = document.querySelector('.temp');
const humidity = document.querySelector('.humidity');

const feelsLike = document.querySelector('.feels-like');
const pressure = document.querySelector('.pressure');
const maxTemperature = document.querySelector('.max-temperature');
const minTemperature = document.querySelector('.min-temperature');
const icon = document.querySelector('.icon');
const anim = document.querySelectorAll('.anim');

let fahrenheit = false;
let temp;

const changeButton= document.querySelector('.button-change-units');
const moreDataButton = document.querySelector('.button-more-data');
const moreDataButtonText = document.querySelector('.button-more-data span');
const moreData = document.querySelector(".more-data");

let lat = NaN; 
let lon = NaN;
let geo = false;
let city;
let url = '';

let timeZoneUser = 0;
let timeZone = 0;

//Get information from API
const getWeather = (url,  geo) => {
    if  (!input.value && geo === false) {
        city = 'London'
        url = apiLink + parameterForCityName + city + apiKey + units;
        timeZoneUser = 3600;
    } else if(!input.value && geo === true) {

    } else {
        city = input.value;
        url = apiLink + parameterForCityName + city + apiKey + units;
    }
    
    axios.get(url)
        .then (res => {
            console.log(res);
            temp = Math.round(res.data.main.temp);
            const hum = Math.round(res.data.main.humidity);
            const fileLike = Math.round(res.data.main.feels_like);
            const press = Math.round(res.data.main.pressure);
            const minT = Math.round(res.data.main.temp_min);
            const maxT = Math.round(res.data.main.temp_max);
            const status = Object.assign({}, ...res.data.weather);
            if  (!input.value && geo === true) {
                timeZoneUser = res.data.timezone;
            };
            timeZone = res.data.timezone;

            cityName.textContent = res.data.name;
            country.textContent = res.data.sys.country;
            weather.textContent = status.main;
            temperature.textContent = temp + ' °C';
            humidity.textContent = hum +' %';
            feelsLike.textContent = fileLike + ' °C';
            pressure.textContent = press + ' hPa';
            maxTemperature.textContent = maxT + ' °C';
            minTemperature.textContent = minT + ' °C';

            warning.textContent = '';
            input.value ='';

            let id = status.id;

            if (id >= 200 && id < 300) {
                picture.setAttribute("src","WeatherApp grafiki/thunderstorm.png" );
            } else if (id >= 300 && id < 400) {
                picture.src = "WeatherApp grafiki/drizzle.png";
            } else if (id >= 500 && id < 600) {
                picture.setAttribute("src","WeatherApp grafiki/rain.png" );
            } else if (id >= 600 && id < 700) {
                picture.setAttribute("src","WeatherApp grafiki/ice.png" );
            } else if (id >= 700 && id < 800) {
                picture.setAttribute("src","WeatherApp grafiki/fog.png" );
            } else if (id == 800) {
                picture.setAttribute("src","WeatherApp grafiki/sun.png" );
            } else if (id >800 && id < 803) {
                picture.setAttribute("src","WeatherApp grafiki/some_clouds.png");                
            } else if (id >= 803 && id < 900) {
                picture.setAttribute("src","WeatherApp grafiki/cloud.png" );
            } else {
                picture.setAttribute("src","WeatherApp grafiki/unknown.png" );
            };
            })
            .catch(() => warning.textContent = 'Write correct city name!');
};

getWeather(url,  geo);

//Geolocation 
const geolocation = {

    urlToApi : (apiLink, lat, lon, apiKey, units) => {
        if (lat && lon) {
            url = apiLink + `lat=${lat}&lon=${lon}` + apiKey + units;
            geo = true;
            } else {
                url = '';
                geo = false;
            }  
            return url, geo
        },

    getGeoLocationOfUser : () => {
        const options = {
            timeout: 5000,
        };

        function success (pos) {
            let crd = pos.coords;
            lat = crd.latitude;
            lon = crd.longitude;
            url, geo = geolocation.urlToApi(apiLink, lat, lon, apiKey, units);
            getWeather(url, geo);
        };

        function error(err) {
            console.warn(`ERROR(${err.code}): ${err.message}`);
            
        };

        navigator.geolocation.getCurrentPosition(success, error, options);
    }
};


const enterCheck = () => {
    if (event.keyCode === 13) {
        getWeather();
    };
};

//geolocation.getGeoLocationOfUser(apiLink, lat, lon, apiKey, units);
setTimeout(() => geolocation.getGeoLocationOfUser(apiLink, lat, lon, apiKey, units), 800);


//Send new city 
btn.addEventListener('click', getWeather);
input.addEventListener('keyup', enterCheck);


//Clock
let dateString;

const clockTime = () => {
    let time = Date.now();
    time = time + (timeZone * 1000 - timeZoneUser * 1000);

    date = new Date(time);
    let minutes;
    (date.getMinutes().toString().length === 2) ? minutes = date.getMinutes() : minutes = '0' + date.getMinutes();
    dateString = date.getDate() + '.' + date.getMonth() + '.' + date.getFullYear() + ' ' + date.getHours() + ':' + minutes;
    
    if (timeZone != timeZoneUser) {
        dateString = 'local time: ' + dateString;
    }

    clock.textContent = dateString;
};

setInterval(clockTime, 1000);


//Covert C to F
const tempConverter = {
    calculate_F : (temperature) => {
        temperature = 32 + (9/5) * temperature;
        return Math.round(temperature);
    }, 
    reverse_function : () => {
        if (fahrenheit === false) {
        changeButton.innerText = '°C';
        fahrenheit = true;
        temperature.innerText = tempConverter.calculate_F(temp) + '°F';

        } else {
            changeButton.innerText = '°F';
            fahrenheit = false;
            temperature.innerText = temp + '°C';            
        }
    }
}

changeButton.addEventListener('click', tempConverter.reverse_function);


//Show more data 
const show_more_Data = () => {

    icon.classList.toggle('rotate');
    if (moreData.classList.contains('hide')) {
        moreData.classList.toggle('active');
        moreData.classList.toggle('hide');
        moreDataButtonText.innerText = 'Hide more data ';
        for (const animItem of anim) {
            animItem .classList.add('visible');
            if (animItem.classList.contains('un-visible')) {
                animItem.classList.remove('un-visible');
            };
        };

    } else if (moreData.classList.contains('active')) {
        moreDataButtonText.innerText = 'More data ';
        for (const animItem of anim) {
            animItem.classList.add('un-visible');
            if (animItem.classList.contains('visible')) {
                animItem.classList.remove('visible');
            };
        };
        const hideF = () => {
            moreData.classList.toggle('active');
            moreData.classList.toggle('hide');
        };

        setTimeout(hideF, 400);
    };
};

moreDataButton.addEventListener('click', show_more_Data);

    });
