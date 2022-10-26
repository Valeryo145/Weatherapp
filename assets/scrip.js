//apiKey = '3490f1caf184961de949ad1089ce71e5'
const apiKey = {
    key: '3490f1caf184961de949ad1089ce71e5'
}

let localStrg = document.getElementById('addtoLocalStorage'); 
let citysearchBtn = document.getElementById('search-button');
let userSearch = document.getElementById('user-search');
let currentDay = document.getElementById('currentDay');
let fiveDay = document.getElementById('fiveDay');
let citiesHist = document.getElementById('userHistory');
let searchHistory = []

//get City
function getCityName() {
    const cityName = userSearch.value.trim()
    targetLatLon(cityName);
}
citysearchBtn.addEventListener('click', getCityName);

//search btn use latlon/API to find city
function targetLatLon(city) {
    let url = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&appid=' + "3490f1caf184961de949ad1089ce71e5";
    fetch(url).then(function (response) {
        return response.json();
    })
        .then(function (data) {
            let lat = data[0].lat
            let lon = data[0].lon
            fivedaySearch(lat, lon)
            currentweatherSearch(lat, lon)
            addtoLocalStorage(data[0].name)
        })
}
//Same day weather
function currentweatherSearch(lat, lon) {
    let api = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=' + "3490f1caf184961de949ad1089ce71e5";
    fetch(api).then(function (response) {
            return response.json();
        })
        .then(function (data) {
            currentDay.innerHTML = '';
//Add date,city,icon,temp,hum
            let date = new Date(data.dt * 1000).toLocaleDateString();            
            let city = data.name;
            let icon = data.weather[0].icon;
            let temp = data.main.temp;
            let wind = data.wind.speed;
            let humidity = data.main.humidity;
            let iconUrl = "https://openweathermap.org/img/w/" + icon + ".png";
            let cityEl = document.createElement('h2');
            let iconEl = document.createElement('img');
            let tempEl = document.createElement('p');
            let windEl = document.createElement('p');
            let humidityEl = document.createElement('p');
            cityEl.setAttribute('class', 'card-title') 
            iconEl.setAttribute('src', iconUrl);
            tempEl.setAttribute('class', 'card-text');
            windEl.setAttribute('class', 'card-text');
            humidityEl.setAttribute('class', 'card-text');
            cityEl.textContent = city + ' ' + date;
            tempEl.textContent = 'TEMP: ' + temp;
            windEl.textContent = 'WIND: ' + wind;
            humidityEl.textContent = 'HUMIDITY: ' + humidity;
            cityEl.append(iconEl)
            currentDay.append(cityEl, tempEl, windEl, humidityEl);

        })

}
//5-Day Forcast
function fivedaySearch(lat, lon) {
    var api = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=' + "3490f1caf184961de949ad1089ce71e5";
    fetch(api)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            fiveDay.innerHTML = ''
            //5 days list 
            var forcast = [data.list[7], data.list[14], data.list[21], data.list[28], data.list[35]];
            var fiveday = document.createElement('h2');
            var forcastInfo = document.createElement('div');
            forcastInfo.setAttribute('class', 'row');
            fiveday.textContent = '5-Day Forcast:';
            for (var i = 0; i < forcast.length; i++) {
                var date = new Date(forcast[i].dt * 1000).toLocaleDateString();
                var icon = forcast[i].weather[0].icon;
                var temp = forcast[i].main.temp;
                var wind = forcast[i].wind.speed;
                var humidity = forcast[i].main.humidity;
                var card2 = document.createElement('div');
                var cardBodyEl = document.createElement('div');
                var dateEl = document.createElement('h4');
                var iconEl = document.createElement('img');
                var tempEl = document.createElement('p');
                var windEl = document.createElement('p');
                var humidityEl = document.createElement('p');
                var iconUrl = "https://openweathermap.org/img/w/" + icon + ".png";
                card2.setAttribute('class', 'card col-2 m-1');
                iconEl.setAttribute('src', iconUrl);
                cardBodyEl.setAttribute('class', 'card-body');
                dateEl.setAttribute('class', 'card-title');
                tempEl.setAttribute('class', 'card-text');
                windEl.setAttribute('class', 'card-text');
                humidityEl.setAttribute('class', 'card-text');
                dateEl.textContent = date;
                tempEl.textContent = 'TEMP: ' + temp;
                windEl.textContent = 'WIND: ' + wind;
                humidityEl.textContent = 'HUMIDITY: ' + humidity;
                cardBodyEl.append(dateEl, iconEl, tempEl, windEl, humidityEl);
                card2.append(cardBodyEl);
                forcastInfo.append(card2);
            }

            fiveDay.append(fiveday, forcastInfo);
        });
}

//currently not working
//save city search to local Storage LS
function addtoLocalStorage(city) {
    if (userHistory.indexOf(city) !== -1) {
        return;
    }
    //save user history
    userHistory.push(city);
    localStorage.setItem('userHistory', JSON.stringify(userHistory));
    citysavedBtn();
}

function addtoLocalStorage() {
    let history = localStorage.getItem('userHistory');
    if (history) {
        userHistory = JSON.parse(history)
    }
    citysavedBtn();
}

addtoLocalStorage();

function citysavedBtn() {
    citiesHist.innerHTML += ''
    for (let i = 0; i < userHistory.length; i++) {
        let btn = document.createElement('button');
        btn.textContent = userHistory[i];
        btn.setAttribute('value', userHistory[i]);
        btn.addEventListener('click', historyBtn);
        citiesHist.append(btn);
    }
}