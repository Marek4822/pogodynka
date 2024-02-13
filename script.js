import { quotes } from "./quote.js";

const api_key = "efc4b99b099a429ba45112015230208";

const search_box = document.querySelector("#city");
const search_btn = document.querySelector("#button");

const connection_api = async function (city) {
  const url = `http://api.weatherapi.com/v1/forecast.json?key=${api_key}&q=${city}&days=1&aqi=no&alerts=no`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (response.status === 200) {
      current_data(data);
      forecast(data);
      date_now();
      scroller();
    } else if (response.status == 400) {
      display_none();
    } else {
      console.log("Server Error:", data.error.message);
    }
  } catch (error) {
    console.log("Error:", error);
  }
};

function current_img(data) {
  const current_img = data.current.condition.icon;
  const img_split = current_img.split("/").slice(-2);
  const splited = img_split[0] + "/" + img_split[1];
  const img_url = "//cdn.weatherapi.com/weather/128x128/";
  document.getElementById("current_img").src = img_url + splited;
}

function current_data(data) {
  console.log(data);
  document.querySelector("#invalid_city").style.display = "none";
  document.querySelector("#data").style.display = "flex";
  document.querySelector(".content").style.display = "block";
  current_img(data);
  document.querySelector("#condition").innerHTML =
    "Condition: " + data.current.condition.text;
  document.querySelector("#temp").innerHTML = data.current.temp_c + "°C";
  document.querySelector("#humidity").innerHTML =
    "Humidity: " + data.current.humidity + "%";
  document.querySelector("#wind").innerHTML =
    "Wind speed: " + data.current.wind_kph + " km/h";
  document.querySelector(".location").innerHTML =
    "Location: " + "<br>" + data.location.country + ", " + data.location.name;
  document.querySelector("#max_temp").innerHTML =
    "Max temp: " + data.forecast.forecastday[0].day.maxtemp_c + "°C";
  document.querySelector("#min_temp").innerHTML =
    "Min temp: " + data.forecast.forecastday[0].day.mintemp_c + "°C";
}

function forecast(data) {
  let text = "";

  const day = new Date();
  let hour = day.getHours();
  let hour_left = 24 - hour;
  let hour_now = 24 - hour_left;

  let counter = hour_now;

  for (let i = 0; i < hour_left; i++) {
    let split_time = data.forecast.forecastday[0].hour[counter].time;
    split_time = split_time.split(" ");
    text += "<ul>";
    text += "<li>" + split_time[1] + "</li>";
    text +=
      "<li>" +
      data.forecast.forecastday[0].hour[counter].temp_c +
      "°C" +
      "</li>";

    text += `<img src="${data.forecast.forecastday[0].hour[counter].condition.icon}" />`;
    //   text += `<img src="${data.forecast.forecastday[0].hour[counter].condition.icon}" id="img' +
    //   i +
    //   '"/>`;
    text +=
      "<li>" +
      "rain: " +
      data.forecast.forecastday[0].hour[counter].chance_of_rain +
      "%" +
      "</li>";
    text += "</ul>";
    counter += 1;
  }
  document.getElementById("forecast").innerHTML = text;
}

search_btn.addEventListener("click", () => {
  connection_api(search_box.value);
});

function scroller() {
  document.querySelector("#forcast_name").style.display = "block";
  document.querySelector(".forecast_all").style.display = "flex";
  let scroll_element = document.querySelector("#forecast");
  let btn_next = document.getElementById("btn_next");
  let btn_back = document.getElementById("btn_back");

  scroll_element.addEventListener("wheel", (evt) => {
    evt.preventDefault();
    scroll_element.scrollLeft += evt.deltaY;
  });

  btn_next.addEventListener("click", () => {
    scroll_element.style.scrollBehavior = "smooth";
    scroll_element.scrollLeft += 400;
  });

  btn_back.addEventListener("click", () => {
    scroll_element.style.scrollBehavior = "smooth";
    scroll_element.scrollLeft -= 400;
  });
}

function date_now() {
  document.querySelector("#date").style.display = "block";
  const day = new Date();
  const day_number = day.getDate();
  const day_name = day.toLocaleString("default", { weekday: "short" });
  const month = day.toLocaleString("default", { month: "long" });
  document.querySelector(
    "#date_name"
  ).innerHTML = `${day_number} ${day_name} ${month}`;
}

function display_none() {
  document.querySelector(".content").style.display = "none";
  document.querySelector("#date").style.display = "none";
  document.querySelector("#invalid_city").style.display = "block";
  document.querySelector("#data").style.display = "none";
  document.querySelector(".forecast_all").style.display = "none";
  document.querySelector("#forcast_name").style.display = "none";
}

function generate_quote(quotes) {
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  document.querySelector("#quote").innerHTML = quote;
}

generate_quote(quotes);
