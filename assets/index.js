const getCity = () => {
	let query = document.querySelector("#city-input");
	console.log(query.value);
	weather.getCity(query.value).then(data => {
		console.log(data);
		setActiveCity(data);
	});
}
let activeCity = null;

const setActiveCity = (cityData) => {
	activeCity = cityData;
	document.querySelector("#active-city-title").textContent = cityData.name;
	document.querySelector("#current-city-current-temp").textContent = temperatureString(cityData.main.temp);
	document.querySelector("#active-city-weather-icon").innerHTML = '<img src="http://openweathermap.org/img/wn/' + cityData.weather[0].icon + '.png">';	
	document.querySelector("#active-city-date").textContent = (new Date(cityData.dt)).toString();
}

// A Global Variable for changing temperature units
var fahrenheit = true;

const temperatureString = (kelvin) => {
	//(0K − 273.15) × 
	let temp = kelvin - 273.15;
	if(fahrenheit){
		temp = (temp * (9/5)) + 32;
	} 
	return Math.round(temp) + "°";
}

const goBtn = document.querySelector("#getCityBtn");
goBtn.addEventListener('click', getCity);

const getWeatherIcon = (conditionCode, imgSrc) => {
	let i = null;
	if(imgSrc){
		i = document.createElement('img');
		i.src = "http://openweathermap.org/img/wn/" + conditionCode + ".png";
	} else {
		i = document.createElement('i');
		i.classList.add('bi');
		//implement switch statement based on condition
		i.classList.add('bi-cloud-rain');
	}
	return i;
}

const makeCityListItem = (name, condition, temp) => {
	const cityListItem = document.createElement('li');
	cityListItem.classList.add('list-group-item');
	cityListItem.classList.add('city-list-item');
	cityListItem.classList.add('d-flex');
	cityListItem.classList.add('justify-content-between');
	const cityName = document.createElement('span');
	cityName.textContent = name;
	cityListItem.appendChild(cityName);
	const infoElement = document.createElement('span');
	infoElement.appendChild(getWeatherIcon(condition, true));
	const temperatureElement = document.createElement('span');
	temperatureElement.textContent = " " + temp;
	infoElement.appendChild(temperatureElement);
	cityListItem.appendChild(infoElement);
	return cityListItem;
}

let cities = [
	{'name':'Everett',
	'condition':'rain',
	'temperature':61},
	{'name':'Seattle',
	'condition':'rain',
	'temperature':60},
	{'name':'San Francisco',
	'condition':'cloudy',
	'temperature':58},
	{'name':'San Diego',
	'condition':'rain',
	'temperature':66},
];

const citiesList = document.querySelector('#city-list-container');
citiesList.innerHTML = "";

const initCities = async () =>{
	await cities.forEach( async function(city) {
		const cityObject = await weather.getCity(city.name);
		city.temperature = temperatureString(cityObject.main.temp);
		let cityListItem = makeCityListItem(city.name, cityObject.weather[0].icon, city.temperature);
		citiesList.appendChild(cityListItem);
		if(cities.indexOf(city) === 0){
			//activeCity = cityObject;
			setActiveCity(cityObject);
		}
	});
}

const addCaret = () => {
	const historyToggleElement = document.createElement('li');
	historyToggleElement.classList.add('list-group-item');
	historyToggleElement.classList.add('d-flex');
	historyToggleElement.classList.add('justify-content-center');
	const caret = document.createElement('i');
	caret.classList.add('bi');
	caret.classList.add('bi-caret-down-fill');
	historyToggleElement.appendChild(caret);
	citiesList.appendChild(historyToggleElement);
}




