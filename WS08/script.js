// Store your OpenWeatherMap API key.
const apiKey = "7892ce093827a891248b828e1ee8f7b9";

// Check the page language (<html lang="en"> or <html lang="fi">).
const isEnglish = document.documentElement.lang === "en";

// Set to true if you want to see the raw XML text instead of the parsed data.
const SHOW_RAW = false;

// Find the HTML elements we need.
const weatherdata = document.querySelector("#weatherdata");
const citySelect = document.querySelector("#city");
const citySearch = document.querySelector("#citysearch");

// Fetch the weather for one city and display it.
async function getWeather(city) {

    // Display a loading message.
    weatherdata.textContent = isEnglish ? "Loading weather data..." : "Ladataan säätietoja...";

    try {
        // mode=xml requests the data in XML format.
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&mode=xml&appid=${apiKey}`
        );

        // Check whether the API returned a successful HTTP status.
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        // Read the response body as text.
        const xmlText = await response.text();

        // Step 1: show the raw XML.
        if (SHOW_RAW) {
            weatherdata.textContent = xmlText;
            return;
        }

        // Step 2: parse the XML text into an XML document.
        const xml = new DOMParser().parseFromString(xmlText, "text/xml");

        // Read values from the XML elements and attributes.
        const cityName = xml.querySelector("city").getAttribute("name");
        const country = xml.querySelector("city country").textContent;
        const temp = xml.querySelector("temperature").getAttribute("value");
        const clouds = xml.querySelector("clouds").getAttribute("value");
        const humidity = xml.querySelector("humidity").getAttribute("value");
        const description = xml.querySelector("weather").getAttribute("value");

        const lines = isEnglish
            ? [
                `City: ${cityName}, ${country}`,
                `Temperature: ${temp} °C`,
                `Cloudiness: ${clouds} %`,
                `Humidity: ${humidity} %`,
                `Weather: ${description}`
            ]
            : [
                `Kaupunki: ${cityName}, ${country}`,
                `Lämpötila: ${temp} °C`,
                `Pilvisyys: ${clouds} %`,
                `Ilmankosteus: ${humidity} %`,
                `Sää: ${description}`
            ];

        // Display each line as its own paragraph.
        weatherdata.innerHTML = "";
        for (const line of lines) {
            const p = document.createElement("p");
            p.textContent = line;
            weatherdata.appendChild(p);
        }

    // Handle errors from the request or the code above.
    } catch (error) {
        const message = isEnglish
            ? "Failed to fetch weather data: "
            : "Säätietojen haku epäonnistui: ";
        weatherdata.textContent = message + error.message;
    }
}

// "Fetch data" button: fetch the city selected in the dropdown.
document.querySelector("#fetchWeather").addEventListener("click", function () {
    getWeather(citySelect.value);
});

// Dropdown: fetch when the user chooses another city.
citySelect.addEventListener("change", function () {
    getWeather(citySelect.value);
});

// Search field: fetch the city the user typed.
document.querySelector("#search").addEventListener("click", function () {
    const query = citySearch.value.trim();
    if (query === "") {
        weatherdata.textContent = isEnglish ? "Enter a city name first." : "Kirjoita ensin kaupungin nimi.";
        return;
    }
    getWeather(query);
});