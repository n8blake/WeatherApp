class WeatherHandler {
	constructor(){
		this._apiKey = null;
	}
	getCity(city){
		const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this._apiKey}`;
		return fetch(url)
			.then(response => {
				//console.log(response);
				if(response.ok){
					return response.json();
				} else {
					return false;
				}
			})
			.then(data => {
				//console.log(data);
				return data;
			});
	}
	getCityForecast(city){
		const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${city.coord.lat}&lon=${city.coord.lon}&appid=${this._apiKey}`;
		return fetch(url)
			.then(response => response.json())
			.then(data => {
				return data;
			});
	}
	set key(k){
		this._apiKey = k;
	}
}

const weather = new WeatherHandler();

fetch('https://blake-ink.com/WeatherAppAccess/')
	.then(response => {
		//console.log(response.json());
		return response.json();
	})
	.then(data => {
		weather.key = data;
		initCities();
	});


// Place holder cities if none in local storage
let demo_cities = ['Everett', 'Seattle', 'Washington', 'Dallas', 'San Diego'];

// get history out of LocalStorage
let citiesStr = localStorage.getItem('cities');
var cities = [];
var citiesObjects = [];
if(citiesStr === null){
	cities = demo_cities;
} else {
	cities = JSON.parse(citiesStr);

}

const updateCityList = async (city) => {
	if(cities.indexOf(city) === -1){
		//console.log("adding: " + city);
		cities.push(city);
		const cityObject = await weather.getCity(city);
		citiesObjects.push(cityObject);
		const temperature = temperatureString(cityObject.main.temp);
		let index = -1;
		citiesObjects.forEach(c => {
			if(c.name === city) index = citiesObjects.indexOf(c);
		});
		let cityListItem = makeCityListItem(city, index, cityObject.weather[0].icon, temperature);
		citiesList.appendChild(cityListItem);
		saveCities();
	}
}

const saveCities = () => {
	let citiesStr = JSON.stringify(cities);
	localStorage.setItem('cities', citiesStr);
}

const removeActiveCityFromCitiesList = () => {
	cities.splice(cities.indexOf(activeCity.name), 1);
	saveCities();
	citiesList.innerHTML = "";
	initCities();
}
