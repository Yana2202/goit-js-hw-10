import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
let searchCountries;
const refs = {
  searchBox: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};
refs.searchBox.addEventListener('input', debounce(searchInfo, DEBOUNCE_DELAY));
// ==============================================================//
function searchInfo(e) {
  e.preventDefault();
  searchCountries = e.target.value.trim();
  if (!searchCountries) {
    return;
  }
  fetchCountries(searchCountries)
    .then(country => createSearchCountry(country))
    .catch(error => Notify.failure('Oops, there is no country with that name'));
}
// ====================================================================//
function createSearchCountry(country) {
  if (country.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
  } else if (country.length > 1 && country.length <= 10) {
    createListCountry(country);
    return;
  } else if (country.length === 1) {
    clearRender();
    createListCountryInfo(country);
  }
}
// =========================================================================//
function createListCountry(country) {
  const list = country
    .map(({ name, flags }) => {
      return `<li class="country-item">
      <img class="flags"
      src="${flags.svg}" alt="${name.official}" width="50" height="40">
      <p class="country-name">${name.official}</p></li>`;
    })
    .join('');
  refs.countryList.innerHTML = list;
}
// ==========================================================================//
function createListCountryInfo(country) {
  const list = country
    .map(({ name, capital, flags, population, languages }) => {
      return `<div class="box"><img class="country-info-img" src="${
        flags.svg
      }" alt="${name.official}" width="50" height="40">
      <h2 class="country-info-title">${name.official}</h2></div>
      <ul class="country-info-list">
        <li class="country-info-item">
          <p class="country-info-text">Capital:
           <span class="text-info">${capital[0]}</span></p>
        </li>
        <li class="country-info-item">
          <p class="country-info-text">Population:
           <span class="text-info">${population}</span></p>
        </li>
        <li class="country-info-item">
          <p class="country-info-text">Languages:
           <span class="text-info">${Object.values(languages)}</span></p>
        </li>
      </ul>`;
    })
    .join('');
  refs.countryInfo.innerHTML = list;
}
function clearRender() {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
}
