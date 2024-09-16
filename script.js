"use strict";
const form = document.querySelector(".form");
const inputData = document.querySelector(".search");
const searchBar = document.querySelector(".search-container");
const errorMessage = document.querySelector(".error-message");
const countriesContainer = document.querySelector(".countries");

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

const renderError = function () {
  errorMessage.classList.remove("hidden");
};

// function to render Countries on the page
const renderCountries = function (data) {
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
      <p class="country__row"><span>👫</span>${(
        +data.population / 1000000
      ).toFixed(1)} million people</p>
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

  // Close Button

  const closeBtn = document.querySelectorAll(".close-btn");
  closeBtn.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const card = this.parentNode;
      card.remove();
    });
  });
};

const getJSON = function (url, errorMsg = "Something went wrong") {
  return fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error(`${errorMsg} (${response.status})`);
    }
    return response.json();
  });
};

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
