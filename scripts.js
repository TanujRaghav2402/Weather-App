const iconElement = document.querySelector(".weather-icons");
const tempElement = document.querySelector(".temp-value p");
const descElement = document.querySelector(".temp-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notificationElement p")
const notificationElementHead =document.querySelector(".notificationElement");
const humidElement = document.querySelector(".humidity p:nth-child(2)");
const airElement = document.querySelector(".airPressure p:nth-child(2)");
const rainElement = document.querySelector(".rainChance p:nth-child(2)");
const windElement = document.querySelector(".windSpeed p:nth-child(2)");
const s02Element = document.querySelector(".s02 p:nth-child(2)");
const n02Element = document.querySelector(".n02 p:nth-child(2)");
const pm10Element = document.querySelector(".pm10 p:nth-child(2)");
const pm20Element = document.querySelector(".pm25 p:nth-child(2)");
const O3Element = document.querySelector(".O3 p:nth-child(2)");
const coElement = document.querySelector(".co p:nth-child(2)");
const nh3Element = document.querySelector(".nh3 p:nth-child(2)");
const aqiElement = document.querySelector(".aqi");
const dispInput = document.querySelector(".inputDiv p");

const weather={};
const pollution={};

const limit=5;

weather.temperature={
    unit:"celsius"
}

const KELVIN =273;
// Api Key
const key = "8dde4a058f103d3ed24d112e18302953";

// Checking if browser support geolocation
if('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(setPosition,showError);
}else{
    notificationElementHead.style.display="block";
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "Browser doesn't Support Geolocation"
}

// SET USER POSITION
function setPosition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    
    getWeather(latitude, longitude);
    showPollution(latitude,longitude);
}

function showError(error){
    notificationElementHead.style.display = "block";
    // notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p>${error.message}</p>`
}   

function searchNew(event){
    let city_name = event.previousElementSibling.value;
    let state = event.previousElementSibling.value;
    
    if(city_name === ""){
        notificationElementHead.style.display="block";
        notificationElement.innerHTML = "Location value has been left blank"
    }else{
        
        let api=`http://api.openweathermap.org/geo/1.0/direct?q=${city_name},${state}&limit=${limit}&appid=${key}`;
    
        fetch(api)
        .then(function(response){
            let data=response.json();
            return data;
        })
        .then(function(data){
            if(data.length!=0){
                notificationElementHead.style.display="none";
                let lat = data[0].lat;
                let lon = data[0].lon;

                getWeather(lat, lon);
                showPollution(lat ,lon);
            }else{
                notificationElementHead.style.display="block";
                notificationElement.innerHTML = "No such State/City found"
            }
        })
    event.previousElementSibling.value ="";
    }
}

function getWeather(latitude,longitude){
    let api =`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;

    fetch(api)
    .then(function(response){
        let data =response.json();
        return data;
    })
    .then(function(data){
        weather.temperature.value = Math.floor(data.main.temp -KELVIN);
        weather.description =data.weather[0].description;
        weather.iconId =data.weather[0].icon;
        weather.city = data.name;
        weather.country = data.sys.country;
        weather.humidity =data.main.humidity;
        weather.airPressure=data.main.pressure;
        weather.rainChances=data.clouds.all;
        weather.windSpeed=data.wind.speed;
    })
    .then(function(){
        displayWeather();
    });
}

function showPollution(latitude,longitude){
    let api=`http://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${key}`;

    fetch(api)
    .then(function(response){
        let data =response.json();
        return data;
    })
    .then(function(data){
        pollution.so2 = data.list[0].components.so2;
        pollution.no2 = data.list[0].components.no2;
        pollution.pm10 = data.list[0].components.pm10;
        pollution.pm25 = data.list[0].components.pm2_5;
        pollution.o3 = data.list[0].components.o3;
        pollution.co = data.list[0].components.co;
        pollution.nh3 = data.list[0].components.co;
        pollution.aqi =data.list[0].main.aqi;
    })
    .then(function(){
        displayPollution();
    })
}

function displayWeather(){
    iconElement.innerHTML =`<img src="icons/${weather.iconId}.png"/>`;
    tempElement.innerHTML =`${weather.temperature.value}°<span>C</span>`;
    descElement.innerHTML =weather.description;
    locationElement.innerHTML=`${weather.city}, ${weather.country}`;
    humidElement.innerHTML=`${weather.humidity}<span> %</span>`;
    airElement.innerHTML=`${weather.airPressure}<span> PS</span>`;
    rainElement.innerHTML=`${weather.rainChances}%`;
    windElement.innerHTML=`${weather.windSpeed}<span> km/h</span>`
}

function displayPollution(){
    s02Element.innerHTML =`${pollution.so2}`;
    n02Element.innerHTML =`${pollution.no2}`;
    pm10Element.innerHTML =`${pollution.pm10}`;
    pm20Element.innerHTML =`${pollution.pm25}`;
    O3Element.innerHTML =`${pollution.o3}`;
    coElement.innerHTML =`${ pollution.co}`;
    nh3Element.innerHTML =`${ pollution.nh3}`;
    aqiElement.innerHTML = `<span>(AQI </span>${pollution.aqi})`
}

// C to F conversion
function celsiusToFahrenheit(temperature){
    return (temperature * 9/5) + 32;
}

// WHEN THE USER CLICKS ON THE TEMPERATURE ELEMENET
tempElement.addEventListener("click", function(){
    if(weather.temperature.value === undefined) return;
    
    if(weather.temperature.unit == "celsius"){
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);
        
        tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
        weather.temperature.unit = "fahrenheit";
    }else{
        tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        weather.temperature.unit = "celsius"
    }
});

// let isClicked =true;

aqiElement.addEventListener("click",function(){
    // isClicked =!isClicked;
    switch(pollution.aqi){
        case 1:
            aqiElement.innerHTML="(Good)";
            break;
        case 2:
            aqiElement.innerHTML="(Fair)";
            break;
        case 3:
            aqiElement.innerHTML="(Moderate)";
            break;
        case 4:
            aqiElement.innerHTML="(Poor)";
            break;
        default:
            aqiElement.innerHTML="(Very Poor)";
            break;
        // default:
        //     aqiElement.innerHTML=`<span>(AQI </span>${pollution.aqi})`;
        //     break;    
    }
})


dispInput.addEventListener("click",function(element){
    let mainElement = element.target;
    let srcBtn = mainElement.nextElementSibling;
    srcBtn.style.display="inline-block";
    let inputField = document.createElement("input");
    inputField.type="text";
    inputField.placeholder="Change Location";
    mainElement.parentElement.replaceChild(inputField,mainElement);
    
})

