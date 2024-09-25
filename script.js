"use strict";

const form = document.querySelector(".form");
const inputData = document.querySelector(".search");
const searchBar = document.querySelector(".search-container");
const errorMessage = document.querySelector(".error-message");
const countriesContainer = document.querySelector(".countries");
const currentLocationBtn = document.querySelector(".current-location-btn");
const container = document.querySelector(".container");

let userData;

form.addEventListener("submit", function (e) {
  e.preventDefault();

  userData = inputData.value;

  if (userData === "" || !isNaN(userData)) {
    errorMessage.textContent = "Please enter a valid country name";
    renderError();
  } else {
    errorMessage.classList.add("hidden");
    getCountryData(userData);
  }

  // Clear search bar
  inputData.value = "";
});

/*---------------------------------------------------------------------------------------------------------------------------- */
// Render Error message on the UI

const renderError = function () {
  errorMessage.classList.remove("hidden");
};

/*---------------------------------------------------------------------------------------------------------------------------- */

// function to render Countries on the page

let currentCounter = 0;
let maxCounter = 3;

const renderCountries = function (data) {
  if (currentCounter < maxCounter) {
    console.log(data);
    const html = `
  <article class="country">
  <button class='close-btn'>
  <ion-icon name="close-outline"></ion-icon>
  </button>
  <img class="country__img" src="${data.flags.svg}" />
  <div class="country__data">
  <h3 class="country__name">${data.name.common}</h3>
  <h4 class="country__region">${data.region}</h4>
  <p class="country__row"><span>👫</span>${(+data.population / 1000000).toFixed(
    1
  )} million people</p>
  <p class="country__row"><span>🗣️</span>${
    Object.entries(data.languages)[0][1]
  }</p>
  <p class="country__row"><span>💰</span>${
    Object.entries(data.currencies)[0][0]
  }, ${Object.entries(data.currencies)[0][1].name}</p>
  </div>
  </article>
  `;
    countriesContainer.insertAdjacentHTML("beforeend", html);
    currentCounter++;
    console.log(currentCounter);
  } else {
    errorMessage.textContent = "Maximum number of countries reached";
    renderError();
  }

  /*---------------------------------------------------------------------------------------------------------------------------- */
  // Close Button

  const closeBtns = Array.from(document.querySelectorAll(".close-btn"));

  for (let i = 0; i < closeBtns.length; i++) {
    closeBtns[i].addEventListener("click", (event) => {
      event.stopPropagation();
      const closeButton = event.target;
      const countryCard = closeButton.closest(".country");
      if (!countryCard.classList.contains("removed")) {
        countryCard.classList.add("removed");
        countryCard.remove();
        errorMessage.classList.add("hidden");
        currentCounter--;
        console.log(currentCounter);
      }
    });
  }
};

/*---------------------------------------------------------------------------------------------------------------------------- */

const getJSON = function (url, errorMsg = "Something went wrong") {
  return fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error(`${errorMsg} (${response.status})`);
    }
    return response.json();
  });
};

/*---------------------------------------------------------------------------------------------------------------------------- */
// Prompts the get current Location on the browser

const getLocation = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};
/*---------------------------------------------------------------------------------------------------------------------------- */
// Function to fetch data from the API and return it

const getCountryData = function (country) {
  getJSON(
    `https://restcountries.com/v3.1/name/${country}?fullText=true`,
    "Country not found"
  ) // fetches the data
    .then((data) => renderCountries(data[0])) // gets the required data from the object
    .catch(
      (err) => (renderError(), (errorMessage.textContent = ` ${err.message}`))
    );
};

/*---------------------------------------------------------------------------------------------------------------------------- */
// Functions to generate data for currentLocation

const requestOptions = {
  method: "GET",
};
const getCurrentLocation = async function () {
  try {
    const position = await getLocation();
    const { latitude: lat, longitude: lng } = position.coords;

    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=488790058b9a49bdbff27bd9e8056184`,
      requestOptions
    );
    if (!response.ok) {
      throw new Error("Problem getting location data");
    }
    const dataGeo = await response.json();
    console.log(dataGeo);

    const res = await fetch(
      `https://restcountries.com/v3.1/name/${dataGeo.features[0].properties.country}?fullText=true`
    );
    if (!res.ok) {
      throw new Error("Problem getting country data");
    }
    const data = await res.json();
    console.log(data);
    renderCountries(data[0]);
  } catch (err) {
    console.log(err);
    renderError();
    errorMessage.textContent = ` ${err.message}`;
  }
};

currentLocationBtn.addEventListener("click", getCurrentLocation);
