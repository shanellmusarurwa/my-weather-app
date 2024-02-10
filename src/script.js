function refreshData(response) {
  let tempElement = document.querySelector("#current-temp");
  let cityElement = document.querySelector("#current-city");
  let humidityElement = document.querySelector("#humidity-result");
  let windElement = document.querySelector("#wind-result");
  let temperature = response.data.temperature.current;
  let iconElement = document.querySelector("#conditions-icon");
  let conditionsElement = document.querySelector("#condition-description");
  let date = new Date(response.data.time * 1000);
  let dateElement = document.querySelector("#date");

  cityElement.innerHTML = response.data.city;
  tempElement.innerHTML = Math.round(temperature);
  humidityElement.innerHTML = `${response.data.temperature.humidity}%`;
  windElement.innerHTML = `${response.data.wind.speed}km/hr`;
  conditionsElement.innerHTML = response.data.condition.description;
  iconElement.innerHTML = `
    <img
      src="${response.data.condition.icon_url}"
      alt="${response.data.condition.icon}"
    />
  `;
  dateElement.innerHTML = formatDate(date);

  getForecast(response.data.city);
}

function formatDate(date) {
  let currentDateElement = document.querySelector("#dateTime");
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = months[date.getMonth()];
  let hour = date.getHours();
  let minutes = date.getMinutes();
  let amPm = "AM";

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  if (hour > 11) {
    amPm = "PM";
  }

  return `${day}, ${date.getDate()} ${month} </br> ${hour}:${minutes} ${amPm}`;
}

function apiCitySearch(city) {
  let apiKey = "077f0bf465660295fb983d4cdo70dabt";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;

  axios.get(apiUrl).then(refreshData);
}

function handleCitySearch(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-field");

  apiCitySearch(searchInput.value);
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[date.getDay()];
}

function getForecast(city) {
  let apiKey = "077f0bf465660295fb983d4cdo70dabt";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayForecast(response) {
  let forecastHtml = "";

  response.data.daily.forEach(function (day, index) {
    if (index < 5) {
      forecastHtml =
        forecastHtml +
        `
<div class="forecast-col">
          <div class="forecast-day">${formatDay(day.time)}</div>
          <div class="forecast-conditions">
            <img src="${day.condition.icon_url}"
              alt="forecast-conditions"
              class="forecast-conditions-icon"
            />
          </div>
          <div class="forecast-temperature">
            <span class="forecast-temperature-max">${Math.round(
              day.temperature.maximum
            )}° </span>
            <span class="forecast-temperature-min"> ${Math.round(
              day.temperature.minimum
            )}°</span>
          </div>
        </div>
`;
    }
  });
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = forecastHtml;
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleCitySearch);

apiCitySearch("Harare");
