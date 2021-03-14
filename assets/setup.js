class WeatherHandler {
	constructor(){
		this._apiKey = null;
	}
	getCity(city){
		const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this._apiKey}`;
		return fetch(url)
			.then(response => response.json())
			.then(data => {
				console.log(data);
				return data;
			});
	}
	getCityForecast(city){
		const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this._apiKey}`;
		return fetch(url)
			.then(response => response.json())
			.then(data => {
				console.log(data);
				return data;
			});
	}
	set key(k){
		console.log(k);
		this._apiKey = k;
	}
}

const weather = new WeatherHandler();

fetch('http://localhost:9999/')
	.then(response => response.json())
	.then(data => {
		weather.key = data;
		initCities().then(addCaret());
	});