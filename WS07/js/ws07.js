//Harjoitus 1:
const text = '{ "employees" : [' +
    '{ "firstName":"John" , "lastName":"Doe" },' +
    '{ "firstName":"Anna" , "lastName":"Smith" },' +
    '{ "firstName":"Peter" , "lastName":"Jones" } ]}';

const data = JSON.parse(text);
const jsondata = document.getElementById("jsondata");

document.getElementById("showNames").addEventListener("click", function () {
    jsondata.innerHTML = "";
    for (const person of data.employees) {
        const p = document.createElement("p");
        p.textContent = person.firstName + " " + person.lastName;
        jsondata.appendChild(p);
    }
});

document.getElementById("showAll").addEventListener("click", function () {
    jsondata.innerHTML = "";
    for (const person of data.employees) {
        const p = document.createElement("p");
        p.textContent = "Etunimi: " + person.firstName + ", sukunimi: " + person.lastName;
        jsondata.appendChild(p);
    }
});

// Harjoitus 2
const omdbUrl = "https://www.omdbapi.com/?s=star+wars&apikey=cbbc6750";
const rawdata = document.getElementById("rawdata");

// Raakadata
document.getElementById("loadRaw").addEventListener("click", async function () {
    rawdata.textContent = "Ladataan...";
    try {
        const response = await fetch(omdbUrl);
        const rawText = await response.text();
        rawdata.textContent = rawText;
    } catch (error) {
        rawdata.textContent = "Virhe haussa: " + error.message;
    }
});

// Parsittu data taulukkona ja julisteet
document.getElementById("loadParsed").addEventListener("click", async function () {
    rawdata.textContent = "Ladataan...";
    try {
        const response = await fetch(omdbUrl);
        const result = await response.json();

        if (result.Response === "False") {
            rawdata.textContent = "Ei tuloksia: " + result.Error;
            return;
        }

        const table = document.createElement("table");
        table.border = "1";

        const headerRow = document.createElement("tr");
        for (const title of ["Juliste", "Nimi", "Vuosi", "Tyyppi", "IMDb-tunnus"]) {
            const th = document.createElement("th");
            th.textContent = title;
            headerRow.appendChild(th);
        }
        table.appendChild(headerRow);

        for (const movie of result.Search) {
            const row = document.createElement("tr");

            const posterCell = document.createElement("td");
            if (movie.Poster && movie.Poster !== "N/A") {
                const img = document.createElement("img");
                img.src = movie.Poster;
                img.alt = movie.Title;
                img.width = 80;
                posterCell.appendChild(img);
            } else {
                posterCell.textContent = "Ei kuvaa";
            }
            row.appendChild(posterCell);

            for (const value of [movie.Title, movie.Year, movie.Type, movie.imdbID]) {
                const td = document.createElement("td");
                td.textContent = value;
                row.appendChild(td);
            }
            table.appendChild(row);
        }

        rawdata.innerHTML = "";
        rawdata.appendChild(table);
    } catch (error) {
        rawdata.textContent = "Virhe haussa: " + error.message;
    }
});

// Harjoitus 3
const WEATHER_KEY = "7892ce093827a891248b828e1ee8f7b9";

const weatherdata = document.getElementById("weatherdata");
const citySelect = document.getElementById("city");
const citySearch = document.getElementById("citysearch");

async function getWeather(city) {
    weatherdata.textContent = "Ladataan...";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" +
        encodeURIComponent(city) + "&units=metric&lang=fi&appid=" + WEATHER_KEY;

    try {
        const response = await fetch(url);
        const weather = await response.json();

        if (Number(weather.cod) !== 200) {
            weatherdata.textContent = "Haku epäonnistui: " + weather.message;
            return;
        }

        weatherdata.innerHTML = "";
        const lines = [
            "Kaupunki: " + weather.name + ", " + weather.sys.country,
            "Lämpötila: " + weather.main.temp + " °C",
            "Tuntuu kuin: " + weather.main.feels_like + " °C",
            "Pilvisyys: " + weather.clouds.all + " %",
            "Ilmankosteus: " + weather.main.humidity + " %",
            "Sää: " + weather.weather[0].description
        ];
        for (const line of lines) {
            const p = document.createElement("p");
            p.textContent = line;
            weatherdata.appendChild(p);
        }
    } catch (error) {
        weatherdata.textContent = "Virhe haussa: " + error.message;
    }
}

// Painike hakee valitun kaupungin säädatan
document.getElementById("getWeather").addEventListener("click", function () {
    getWeather(citySelect.value);
});

// Pudotusvalikko 
citySelect.addEventListener("change", function () {
    getWeather(citySelect.value);
});

// Hakukenttä
document.getElementById("search").addEventListener("click", function () {
    const query = citySearch.value.trim();
    if (query === "") {
        weatherdata.textContent = "Kirjoita ensin kaupungin nimi.";
        return;
    }
    getWeather(query);
});