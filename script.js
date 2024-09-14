"use strict";
const form = document.querySelector(".form");
const inputData = document.querySelector(".search");
const countriesContainer = document.querySelector(".countries");

let userData;

form.addEventListener("submit", function (e) {
  e.preventDefault();
  userData = inputData.value;
  console.log(userData);
  getCountryData(userData);
});

// function to render Countries on the page
const renderCountries = function (data) {
  const html = `
  <article class="country">
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
};

// Function to fetch data from the API and return it
const getCountryData = function (country) {
  fetch(`https://restcountries.com/v3.1/name/${country}`)
    .then((response) => response.json()) // converts the raw fetched data into object using json()
    .then((data) => renderCountries(data[0])); // gets the required data from the object
};
