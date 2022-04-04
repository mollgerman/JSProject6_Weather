
let searchBarStatus = "closed";
const options = {
	method: 'GET',
	headers: {
		'X-BingApis-SDK': 'true',
		'X-RapidAPI-Host': 'bing-news-search1.p.rapidapi.com',
		'X-RapidAPI-Key': 'b889bf1c4emsh4437f14a17f5b24p1c7674jsn84e76ea7186c'
	}
};

let weather = {
    apiKey: "5ae1d24d7d131067549495858cd5f8e8",
    getCoordinates: function () {
        navigator.geolocation.getCurrentPosition(position => {
            const {latitude, longitude} = position.coords;
            this.fetchWeatherByCoordenates(latitude, longitude)
        })
    },
    fetchWeatherByCoordenates:  function (latitude, longitude) {
        console.log(latitude, longitude)
        fetch(
            "https://api.openweathermap.org/data/2.5/onecall?lat="
            + latitude
            + "&lon="
            + longitude
            + "&units=metric&appid="
            + this.apiKey
        )
        .then((response) => response.json())
        .then((data) => this.displayWeatherWithCoordinates(data));    
        
    },/*
    fetchWeatherByCity: function (city) {
        city != null ? city = city : city = document.querySelector(".search-bar").value;
        console.log(city)
        fetch(
            "https://api.openweathermap.org/data/2.5/find?q=" 
            + city 
            + "&units=metric&appid="
            + this.apiKey
        )
        .then((response) => response.json())
        .then((data) => this.displayWeatherByCity(data));
    },*/
    fetchWeatherByCityOnSearch: function (city) {
        city != null ? city = city : city = document.querySelector(".search-bar").value;
        console.log(city)
        fetch(
            "https://api.openweathermap.org/data/2.5/find?q=" 
            + city 
            + "&units=metric&appid="
            + this.apiKey
        )
        .then((response) => response.json())
        .then((data) => this.displayCitiesOnSearch(data));
    },
    /*displayWeatherByCity: function (data) { },*/
    displayCitiesOnSearch: function (data) {
        const results = document.querySelector(".results");

        if(data.cod == 400) return results.innerHTML = '';

        let searchItems = data.list
            .map(item => {
                return `<div class="places" id="${item.id}">${item.name}, ${item.sys.country}</div>`})
            .join('')
        results.innerHTML = searchItems;

        const places = document.querySelectorAll(".places")
        places.forEach((place) => {
            place.addEventListener("click", () => {

                let toDisplay = data.list.filter(item => item.id == place.getAttribute("id"));
                const { lat, lon } = toDisplay[0].coord;
                const { name } = toDisplay[0];
                const { temp, feels_like, temp_min, temp_max, pressure, humidity } = toDisplay[0].main;
                const { country } = data.list[0].sys;
                const { main, description, icon } = toDisplay[0].weather[0];
                document.querySelector(".city").innerHTML = `${name}, ${country}`;
                document.querySelector(".temp").innerHTML = temp + "°C";
                document.querySelector(".state").innerHTML = main;
                document.querySelector(".sub-state").innerHTML = description;
                document.querySelector(".min-max").innerHTML = `${temp_min}° / ${temp_max}°`;
                document.querySelector(".feels-like").innerHTML = `Feels like: ${feels_like}°`;
                document.querySelector(".pressure").innerHTML = `Pressure: ${pressure}mbar`;
                document.querySelector(".humidity").innerHTML = `Humidity: ${humidity}%`;
                document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png";
                document.body.style.backgroundImage = "url('https://source.unsplash.com/1600x900/?" + name + "')";
                fetch(
                    "https://api.openweathermap.org/data/2.5/onecall?lat="
                    + lat
                    + "&lon="
                    + lon
                    + "&units=metric&appid="
                    + this.apiKey
                )
                .then((response) => response.json())
                .then((data) => {
                    const { daily } = data;
                    let daysToDisplay = daily.map((day) => {
                        return `<div class="day">
                                    <div class="date">${timestampToDate(day.dt).stringFullDay} ${timestampToDate(day.dt).day}/${timestampToDate(day.dt).month}</div>
                                    <img class="icon" src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png"></img>
                                    <div class="day-state">${day.weather[0].main}</div>
                                    <div class="temp">${day.temp.min}° / ${day.temp.max}°</div>
                                </div>`
                    }).slice(1).join('');
                    document.querySelector(".daily").innerHTML = daysToDisplay
                });   
                fetch(
                    'https://bing-news-search1.p.rapidapi.com/news?cc='
                    + country
                    + '&setLang=en&safeSearch=Off&textFormat=Raw', options)
                    .then(response => response.json())
                    .then(response => {
                        const { value } = response;
                        console.log(value)
                        let newsToDisplay = value.map(item => {
                            let dateOrTimePublished = item.datePublished.split('T').slice(0,1)[0].split('-').slice(1).join('/');
                            if (item.image) return `<a href=${item.url}>
                                        <div class="new">
                                            <div class="new-title">${item.name}</div>
                                            <img class="new-img" src="${item.image.thumbnail.contentUrl}" alt="">
                                            <div class="new-provider-and-time">${item.provider[0].name} - ${dateOrTimePublished} </div>
                                        </div>
                                    </a>`
                        }).join('')
                        document.querySelector(".news").innerHTML = newsToDisplay
                    })
                    .catch(err => console.error(err));
                results.classList.add("hide-results");
                searchBarStatus = "closed";
            })
        })
        
    },
    displayWeatherWithCoordinates: function (data) {
        let name = data["timezone"];
        let country = name.split('/').slice(1,2).join('')
       
        let nameForPicture = name.split(',').slice(0, 1).join();
        name = name.split('/').reverse().join(', ').split('_').join(' ');
        
        const { temp, feels_like, pressure, humidity } = data.current; 
        const { main, description, icon } = data.current.weather[0];
        const { min, max } = data.daily[0].temp;
        
        document.querySelector(".city").innerHTML = name;
        document.querySelector(".temp").innerHTML = temp + "°C";
        document.querySelector(".state").innerHTML = main;
        document.querySelector(".sub-state").innerHTML = description;
        document.querySelector(".min-max").innerHTML = `${min}° / ${max}°`;
        document.querySelector(".feels-like").innerHTML = `Feels like: ${feels_like}°`;
        document.querySelector(".pressure").innerHTML = `Pressure: ${pressure}mbar`;
        document.querySelector(".humidity").innerHTML = `Humidity: ${humidity}%`;
        document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png"

        const { daily } = data;
        let daysToDisplay = daily.map((day) => {
            return `<div class="day">
                        <div class="date">${timestampToDate(day.dt).stringFullDay} ${timestampToDate(day.dt).day}/${timestampToDate(day.dt).month}</div>
                        <img class="icon" src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png"></img>
                        <div class="day-state">${day.weather[0].main}</div>
                        <div class="temp">${day.temp.min}° / ${day.temp.max}°</div>
                    </div>`
        }).slice(1).join('');
        document.querySelector(".daily").innerHTML = daysToDisplay
        document.body.style.backgroundImage = "url('https://source.unsplash.com/1600x900/?" + nameForPicture + "')";
        fetch('https://restcountries.com/v3.1/name/'+ country)
        .then(response => response.json())
	    .then(response => {
            country = response[0].altSpellings[0]
            fetch(
                'https://bing-news-search1.p.rapidapi.com/news?cc='
                + country
                + '&setLang=en&safeSearch=Off&textFormat=Raw', options)
                .then(response => response.json())
                .then(response => {
                    const { value } = response;
                    console.log(value)
                    let newsToDisplay = value.map(item => {
                        let dateOrTimePublished = item.datePublished.split('T').slice(0,1)[0].split('-').slice(1).join('/');
                        if (item.image) return `<a href=${item.url}>
                                    <div class="new">
                                        <div class="new-title">${item.name}</div>
                                        <img class="new-img" src="${item.image.thumbnail.contentUrl}" alt="">
                                        <div class="new-provider-and-time">${item.provider[0].name} - ${dateOrTimePublished} </div>
                                    </div>
                                </a>`
                    }).join('')
                    document.querySelector(".news").innerHTML = newsToDisplay
                })
                .catch(err => console.error(err));
        });
    }
}

const searchBar = document.querySelector('.search-bar');

/*document.addEventListener('click', function(){
    console.log("click")
    const results = document.querySelector(".results") ;
    results.classList.add("hide-results")
})*/
searchBar.addEventListener('click', function(){
    const results = document.querySelector(".results");
        if (searchBarStatus == "closed") {
         results.classList.remove("hide-results");
         searchBarStatus="open";
         
        }
        else{results.classList.add("hide-results");searchBarStatus="closed"}
        document.onkeydown=function(){
            setTimeout(() => {weather.fetchWeatherByCityOnSearch()}, 100)
        }
      
});


function logKey(e) {
  log.textContent += ` ${e.code}`;
}

/*document.onkeydown=function(){
    if(window.event.keyCode=='13'){
        weather.fetchWeatherByCity();
    }
}*/

function timestampToDate (timestamp) {
    var date = new Date(timestamp * 1000);
    return {
        day: date.getDate(),
        month: date.getMonth() + 1,
        stringDay: date.toDateString().split(' ').shift(),
        stringFullDay: getWeekDay(date)
    }
}

function getWeekDay(date)
{
        
    return date.toLocaleDateString('en-US', { weekday: 'long' });
    
}

weather.getCoordinates();





/*fetchWeatherByCity: function (city) {
        city != null ? city = city : city = document.querySelector(".search-bar").value;
        console.log(city)
        fetch(
            "https://api.openweathermap.org/data/2.5/find?q=" 
            + city 
            + "&units=metric&appid="
            + this.apiKey
        )
        .then((response) => response.json())
        .then((data) => this.displayWeatherByCity(data));
    }, */