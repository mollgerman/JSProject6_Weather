let weather = {
    apiKey: "5ae1d24d7d131067549495858cd5f8e8",
    fetchWeather: function (city) {
        city != null ? city = city : city = document.querySelector(".search-bar").value;
        console.log(city)
        fetch(
            "https://api.openweathermap.org/data/2.5/find?q=" 
            + city 
            + "&units=metric&appid="
            + this.apiKey
        )
        .then((response) => response.json())
        .then((data) => this.displayWeather(data));
    },
    displayWeather: function (data) {
        const { temp } = data.list[0].main;
        const { name } = data.list[0];
        const { main, description, icon } = data.list[0].weather[0];
        document.querySelector(".city").innerHTML = name;
        document.querySelector(".temp").innerHTML = temp + "°C";
        document.querySelector(".state").innerHTML = main;
        document.querySelector(".sub-state").innerHTML = description;
        document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png"
        document.body.style.backgroundImage = "url('https://source.unsplash.com/1600x900/?" + name + "')";
        console.log(icon)
    }
}



document.onkeydown=function(){
    if(window.event.keyCode=='13'){
        weather.fetchWeather();
    }
}
weather.fetchWeather("London")