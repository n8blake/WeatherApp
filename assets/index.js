
const citiesList = document.querySelector('#city-list-container');
const cityErrorAlert = document.querySelector("#invalid-city-error");
const cityListCaretIcon = document.querySelector("#collapse-caret-icon");

const getCity = () => {
	let query = document.querySelector("#city-input");
	//console.log(query.value);
	weather.getCity(query.value).then(data => {
		//console.log(data);
		if(data){
			setActiveCity(data);
			updateCityList(data.name);
			dismissAlert();
		} else {
			showAlert();
		}
	});
}

const showAlert = () => {
	cityErrorAlert.style.display = "block";
}

const dismissAlert = () => {
	cityErrorAlert.style.display = "none";	
}

citiesList.addEventListener('hide.bs.collapse', function(){
	cityListCaretIcon.classList.remove('bi-caret-up-fill');
	cityListCaretIcon.classList.add('bi-caret-down-fill');
});

citiesList.addEventListener('show.bs.collapse', function(){
	cityListCaretIcon.classList.remove('bi-caret-down-fill');
	cityListCaretIcon.classList.add('bi-caret-up-fill');
});

var cityListCollapse = new bootstrap.Collapse(citiesList, {
  show: true
})


let activeCity = null;
let activyCityForecastData = null;

const setActiveCity = async (cityData) => {
	//console.log(cityData);
	activeCity = cityData;
	document.querySelector("#active-city-title").textContent = cityData.name;
	document.querySelector("#current-city-current-temp").textContent = temperatureString(cityData.main.temp);
	document.querySelector("#active-city-weather-icon").innerHTML = '<img src="http://openweathermap.org/img/wn/' + cityData.weather[0].icon + '@2x.png">';	
	document.querySelector("#active-city-date").textContent = longDateString(dateObject(cityData.dt));
	document.querySelector("#active-city-high").textContent = "High: " + temperatureString(cityData.main.temp_max);
	document.querySelector("#active-city-low").textContent = "Low: " + temperatureString(cityData.main.temp_min);
	document.querySelector("#active-city-humidity").textContent = "Humidity: " + cityData.main.humidity + "%";
	// get city forecase
	activityCityForecastData = await weather.getCityForecast(cityData);
	// for each day in the forecase, make a day card
	const forecastContainer = document.querySelector("#forecast-container");
	forecastContainer.innerHTML = "";
	activityCityForecastData.daily.forEach(day => {
		if(activityCityForecastData.daily.indexOf(day) === 0){
			const uviElement = document.querySelector("#active-city-uvi");
			uviElement.textContent = "UVI: " + day.uvi;
			const uviClasses = ['uvi-low', 'uvi-moderate', 'uvi-high', 'uvi-very-high', 'uvi-extreme'];
			uviClasses.forEach(uviClass => {uviElement.classList.remove(uviClass)});
			if(day.uvi > 0 && day.uvi < 3){
				// low - green
				uviElement.classList.add(uviClasses[0]);
			} else if (day.uvi >= 3 && day.uvi < 6){
				// moderate - yellow
				uviElement.classList.add(uviClasses[1]);
			} else if(day.uvi >= 6 && day.uvi < 8){
				// high - orange
				uviElement.classList.add(uviClasses[2]);
			} else if(day.uvi >= 8 && day.uvi < 11){
				// very high - red
				uviElement.classList.add(uviClasses[3]);
			} else {
				// extreme - purple
				uviElement.classList.add(uviClasses[4]);
			}
		}
		let card = makeDayCard(day);
		forecastContainer.appendChild(card);
	});
	// update dom
}

// A Global Variable for changing temperature units
var fahrenheit = true;

const temperatureString = (kelvin) => {
	let temp = kelvin - 273.15;
	if(fahrenheit){
		temp = (temp * (9/5)) + 32;
	} 
	return Math.round(temp) + "°";
}

const dateObject = (utcSeconds) => {
	let d = new Date(0);
	d.setUTCSeconds(utcSeconds);
	return d;
}

// Get Short Date string Mon 15 Mar
const shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const shortDateString = (dateObject) => {
	return shortDays[dateObject.getDay()] + ' ' + dateObject.getDate() + ' ' + shortMonths[dateObject.getMonth()];
}

// Get Long Date string  Monday 15 March, 2021
const longDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const longMonths = ['January', 'February', 'March', 'April', 
'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const longDateString = (dateObject) => {
	return longDays[dateObject.getDay()] + ' ' + dateObject.getDate() + ' ' + longMonths[dateObject.getMonth()] + ', ' + dateObject.getFullYear();
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

const makeCityListItem = (name, index, condition, temp) => {
	const cityListItem = document.createElement('li');
	cityListItem.classList.add('list-group-item');
	cityListItem.classList.add('city-list-item');
	cityListItem.classList.add('d-flex');
	cityListItem.classList.add('justify-content-between');
	const cityName = document.createElement('h4');
	cityName.classList.add('py-2');
	cityName.classList.add('text-bold');
	cityName.textContent = name;
	cityListItem.appendChild(cityName);
	const infoElement = document.createElement('span');
	infoElement.appendChild(getWeatherIcon(condition, true));
	const temperatureElement = document.createElement('span');
	temperatureElement.textContent = " " + temp;
	infoElement.appendChild(temperatureElement);
	cityListItem.appendChild(infoElement);
	cityListItem.addEventListener('click', function(){
		setActiveCity(citiesObjects[index]);
	}, false);
	return cityListItem;
}



citiesList.innerHTML = "";

const initCities = async () => {
	await cities.forEach( async function(city) {
		//console.log('getting city: ' + city);
		const cityObject = await weather.getCity(city);
		citiesObjects.push(cityObject);
		const temperature = temperatureString(cityObject.main.temp);
		let index = -1;
		citiesObjects.forEach(c => {
			if(c.name === city) index = citiesObjects.indexOf(c);
		});
		let cityListItem = makeCityListItem(city, index, cityObject.weather[0].icon, temperature);
		citiesList.appendChild(cityListItem);
		if(cities.indexOf(city) === 0){
			//activeCity = cityObject;
			setActiveCity(cityObject);
		}
	});
}

const makeDayCard = (dayData) => {
	//console.log(dayData);
	const col = document.createElement('div');
	col.classList.add('col-6');
	col.classList.add('col-md-3')
	//col.classList.add('col-lg-3');
	//col.classList.add('')
	const card = document.createElement('div');
	card.classList.add('card');
	card.classList.add('forecast-card');
	const cardHeader = document.createElement('div');
	cardHeader.classList.add('card-header');
	cardHeader.classList.add('forecast-header');	
	cardHeader.textContent = (shortDateString(dateObject(dayData.dt)));
	card.appendChild(cardHeader);
	const cardBody = document.createElement('div');
	const icon = document.createElement('h4');
	icon.appendChild(getWeatherIcon(dayData.weather[0].icon, true));
	//console.log(icon);
	card.appendChild(icon);
	const tempContainer = document.createElement('div');
	const high = document.createElement('span');
	high.textContent = temperatureString(dayData.temp.max);
	const low = document.createElement('small');
	low.textContent = " / " + temperatureString(dayData.temp.min);
	low.classList.add('text-muted');
	tempContainer.appendChild(high);
	tempContainer.appendChild(low);
	card.appendChild(tempContainer);
	const humidityContainer = document.createElement('small');
	humidityContainer.textContent = "Humidity: " + dayData.humidity + "%";
	humidityContainer.classList.add('p-2');
	card.appendChild(humidityContainer);
	col.appendChild(card);
	return col;
}


