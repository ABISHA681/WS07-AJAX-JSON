
const text = '{"employees":[' +
    '{"firstName":"John","lastName":"Doe"},' +
    '{"firstName":"Anna","lastName":"Smith"},' +
    '{"firstName":"Peter","lastName":"Jones"}]}';

const data = JSON.parse(text);

function showNames() {
    const names = data.employees.map(employee =>
        employee.firstName + " " + employee.lastName
    );

    document.getElementById("jsondata").textContent =
        names.join(", ");
}

function showAllDetails() {
    document.getElementById("jsondata").textContent =
        JSON.stringify(data.employees, null, 2);
}

 // Exercise 2: Fetch Star Wars movie data

const movieURL =
    "https://www.omdbapi.com/?s=star+wars&apikey=cbbc6750";

// Show raw JSON data
async function loadRawData() {
    const output = document.getElementById("rawdata");
    output.textContent = "Loading...";

    try {
        const response = await fetch(movieURL);

        if (!response.ok) {
            throw new Error("Network error");
        }

        const data = await response.json();
        output.textContent = JSON.stringify(data, null, 2);
    } catch (error) {
        output.textContent = "Error loading movie data: " + error.message;
    }
}

// Show parsed movie data in a table
async function loadParsedData() {
    const output = document.getElementById("rawdata");
    output.textContent = "Loading movies...";

    try {
        const response = await fetch(movieURL);

        if (!response.ok) {
            throw new Error("Network error");
        }

        const data = await response.json();

        if (data.Response === "False") {
            throw new Error(data.Error || "No movies found");
        }

        output.replaceChildren();

        const table = document.createElement("table");
        const header = document.createElement("tr");

        ["Poster", "Title", "Year", "Type"].forEach(label => {
            const th = document.createElement("th");
            th.textContent = label;
            header.appendChild(th);
        });

        table.appendChild(header);

        data.Search.forEach(movie => {
            const row = document.createElement("tr");

            const posterCell = document.createElement("td");

            if (movie.Poster && movie.Poster !== "N/A") {
                const img = document.createElement("img");
                img.src = movie.Poster;
                img.alt = movie.Title;
                img.width = 70;
                posterCell.appendChild(img);
            }

            row.appendChild(posterCell);

            [movie.Title, movie.Year, movie.Type].forEach(value => {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            });

            table.appendChild(row);
        });

        output.appendChild(table);
    } catch (error) {
        output.textContent = "Error loading movies: " + error.message;
    }
}


 // Exercise 3: Weather Application using Open-Meteo
// No registration or API key required

const weatherOutput = document.getElementById("weatherdata");
const citySelect = document.getElementById("city");
const citySearch = document.getElementById("citysearch");
const searchButton = document.getElementById("search");

// Get coordinates for a city
async function getWeather(cityName) {
    weatherOutput.textContent = "Loading weather...";

    try {
        // Find city coordinates
        const geoURL =
            "https://geocoding-api.open-meteo.com/v1/search?name=" +
            encodeURIComponent(cityName) + "&count=1";

        const geoResponse = await fetch(geoURL);

        if (!geoResponse.ok) {
            throw new Error("Unable to find city.");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            weatherOutput.textContent = "City not found.";
            return;
        }

        const city = geoData.results[0];

        // Fetch weather information
        const weatherURL =
            "https://api.open-meteo.com/v1/forecast?latitude=" +
            city.latitude + "&longitude=" + city.longitude +
            "&current=temperature_2m,relative_humidity_2m,cloud_cover";

        const response = await fetch(weatherURL);

        if (!response.ok) {
            throw new Error("Weather request failed.");
        }

        const data = await response.json();
        const weather = data.current;

        // Display weather information
        weatherOutput.replaceChildren();

        const heading = document.createElement("h3");
        heading.textContent = "Weather in " + city.name;

        const temperature = document.createElement("p");
        temperature.textContent =
            "Temperature: " + weather.temperature_2m + " °C";

        const humidity = document.createElement("p");
        humidity.textContent =
            "Humidity: " + weather.relative_humidity_2m + "%";

        const clouds = document.createElement("p");
        clouds.textContent =
            "Cloud cover: " + weather.cloud_cover + "%";

        weatherOutput.append(
            heading, temperature, humidity, clouds
        );

    } catch (error) {
        weatherOutput.textContent =
            "Error: " + error.message;
    }
}

// Load weather when a city is selected
citySelect.addEventListener("change", function () {
    getWeather(citySelect.value);
});

// Search weather by city name
searchButton.addEventListener("click", function () {
    const cityName = citySearch.value.trim();

    if (cityName === "") {
        weatherOutput.textContent = "Please enter a city name.";
        return;
    }

    getWeather(cityName);
});

// Allow Enter key to search
citySearch.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        searchButton.click();
    }
});
