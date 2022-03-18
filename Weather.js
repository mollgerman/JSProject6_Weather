
let searchBarStatus = "closed";

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
        
    },
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
    },
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
    displayWeatherByCity: function (data) {
        const { temp } = data.list[0].main; 
        const { name } = data.list[0];
        const { main, description, icon } = data.list[0].weather[0];
        document.querySelector(".city").innerHTML = name;
        document.querySelector(".temp").innerHTML = temp + "°C";
        document.querySelector(".state").innerHTML = main;
        document.querySelector(".sub-state").innerHTML = description;
        document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png";
        document.body.style.backgroundImage = "url('https://source.unsplash.com/1600x900/?" + name + "')";
    },
    displayCitiesOnSearch: function (data) {
        const results = document.querySelector(".results")
        console.log(data.cod)
        if(data.cod == 400) return results.innerHTML = '';
        let co = data.list.map(item => {
            return `<div class="places" id="${item.id}">${item.name}, ${item.sys.country}</div>`
        }).join('')
        console.log('cooo'+ co)
        results.innerHTML = co;
        const places = document.querySelectorAll(".places")
        places.forEach((place) => {
            place.addEventListener("click", () => {
                let toDisplay = data.list.filter(item => item.id == place.getAttribute("id"))
                console.log(toDisplay)
                const { temp } = toDisplay[0].main; 
                const { name } = toDisplay[0];
                const { main, description, icon } = toDisplay[0].weather[0];
                document.querySelector(".city").innerHTML = name;
                document.querySelector(".temp").innerHTML = temp + "°C";
                document.querySelector(".state").innerHTML = main;
                document.querySelector(".sub-state").innerHTML = description;
                document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png";
                document.body.style.backgroundImage = "url('https://source.unsplash.com/1600x900/?" + name + "')";
                results.classList.add("hide-results")
                searchBarStatus = "closed"
            })
        })
        
    },
    displayWeatherWithCoordinates: function (data) {
        const { temp } = data.current; 
        let name = data["timezone"];
        name = name.split('/').reverse().join(', ').split('_').join(' ');
        let nameForPicture = name.split(',').slice(0, 1).join()
        const { main, description, icon } = data.current.weather[0];

        document.querySelector(".city").innerHTML = name;
        document.querySelector(".temp").innerHTML = temp + "°C";
        document.querySelector(".state").innerHTML = main;
        document.querySelector(".sub-state").innerHTML = description;
        document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png"
        document.body.style.backgroundImage = "url('https://source.unsplash.com/1600x900/?" + nameForPicture + "')";
    }
}

const searchBar = document.querySelector('.search-bar');

/*document.addEventListener('click', function(){
    const results = document.querySelector(".results") 
    if (!results.classList.contains("hide-results")) {
    results.classList.add("hide-results")}
})*/
searchBar.addEventListener('click', function(){
    const results = document.querySelector(".results");
        if (searchBarStatus == "closed") {
         results.classList.remove("hide-results");
         searchBarStatus="open";
        }
    document.addEventListener('keydown', function(e){
        
        setTimeout(() => {weather.fetchWeatherByCityOnSearch()}, 10)
    });
});
function logKey(e) {
  log.textContent += ` ${e.code}`;
}

document.onkeydown=function(){
    if(window.event.keyCode=='13'){
        weather.fetchWeatherByCity();
    }
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
let score = []
score.push(1, 2)
console.log(score)