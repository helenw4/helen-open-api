const getWeatherBtn = document.getElementById("getWeatherBtn");
const tempInfo = document.getElementById("temp-info");
const weatherInfo = document.getElementById("weather-info");


getWeatherBtn.style.display = 'none';

var latitude, longitude, name, country;

function GetCityCoordiates(){
	const cityName = document.getElementById("cityName").value.trim();
	const tempInfo = document.getElementById("temp-info");
	
	getWeatherBtn.style.display = 'none';
	weatherInfo.style.display = 'none';
	
	fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1`)
	.then((response)=>{
		 return response.json();
	}).then((geoData)=>{		 
		 console.log(geoData);
		 
		 if (!geoData.results || geoData.results.length === 0) {
			tempInfo.innerHTML = "<p>City not found. Please try again.</p>";
			return;
		}
		
		tempInfo.style.display = 'inline';
		latitude = geoData.results[0].latitude;
		longitude = geoData.results[0].longitude;
		name = geoData.results[0].name;
		country = geoData.results[0].country;
		
		tempInfo.innerHTML = `Loading temprature for ${name}, ${country} ... `;
		
		// Fetch the weather data
		fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m`)
		.then((tempResponse)=>{
			return tempResponse.json();
		}).then((tempJson)=>{
			console.log(tempJson);
			const  currentTemp = tempJson.hourly.temperature_2m[0];
			const  tempUnit = tempJson.hourly_units.temperature_2m;
			
			console.log(currentTemp, tempUnit);
			tempInfo.innerHTML = `The temprature for ${name}, ${country} is ${currentTemp}${tempUnit}`;
			getWeatherBtn.style.display = 'inline'
			
		}).catch((noTempError) => {
		tempInfo.innerHTML = "<p>Unable to load temprature data. Please try again.</p>";
	});
		 
	})
	.catch((noGeoError) => {
		tempInfo.innerHTML = "<p>Unable to load city/location data. Please try again.</p>";
	});
	
}

function getWeather(cityName){
	fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,cloud_cover,visibility,vapour_pressure_deficit&forecast_days=1`)
	.then((response)=>{
		return response.json();
	}).then((weatherResponse)=>{
		weatherInfo.style.display = 'inline';
		document.getElementById("apparent_temperature").innerHTML = `Apparent Temperature: ${weatherResponse.hourly.apparent_temperature[0]}`; 
		document.getElementById("cloud_cover").innerHTML = `Cloud Cover: ${weatherResponse.hourly.cloud_cover[0]}`; 
		document.getElementById("dew_point_2m").innerHTML = `Dew Point: ${weatherResponse.hourly.dew_point_2m[0]}`; 
		document.getElementById("precipitation").innerHTML = `Precipitation: ${weatherResponse.hourly.precipitation[0]}`; 
		document.getElementById("rain").innerHTML = `Rain: ${weatherResponse.hourly.rain[0]}`; 
		document.getElementById("relative_humidity_2m").innerHTML = `Relative Humidity: ${weatherResponse.hourly.relative_humidity_2m[0]}`; 
		document.getElementById("showers").innerHTML = `Showers: ${weatherResponse.hourly.showers[0]}`;  
		document.getElementById("snowfall").innerHTML = `Snowfall: ${weatherResponse.hourly.snowfall[0]}`;  
		document.getElementById("vapour_pressure_deficit").innerHTML = `Vapour Pressure Deficit: ${weatherResponse.hourly.vapour_pressure_deficit[0]}`; 
		document.getElementById("visibility").innerHTML = `Visibility: ${weatherResponse.hourly.visibility[0]}`; 
	})
	.catch((weatherError) => {
		tempInfo.innerHTML = "<p>Unable to load weather data. Please try again.</p>";
	})
}



