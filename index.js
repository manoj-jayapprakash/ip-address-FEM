import { apiKey } from './config.js';

//Variable declaration

const details = document.querySelector('.details');
const btnSearch = document.querySelector('.arrow');
const searchBar = document.querySelector('#searchbar');
const mapView = document.querySelector('.mapView');

//Function definitions
/*  
    DEFINITION:   Returns the response from the API call
    PARAMETERS:   1. url - API endpoint from which the data will be retrieved
*/
const getJsonData = async function (url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Problem fetching data');
    return res.json();
  } catch (e) {
    renderError(e.message);
  }
};

/*  
    DEFINITION:   Verifies whether the given ipaddress is valid or not
    PARAMETERS:   1. input - user entered text in the search bar
*/

const isValidIP = (input) => {
  const ipPattern =
    /^(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])$/g;
  if (ipPattern.test(input)) return true;
  else return false;
};

/*  
    DEFINITION:   Verifies whether the given domain address is valid or not
    PARAMETERS:   1. input - user entered text in the search bar
*/

const isValidDomain = (input) => {
  const domainPattern =
    /^([a-z0-9][a-z0-9-]{0,61}[a-z0-9]?\.)+((xn--[a-z0-9]{0,59})|([a-z][a-z]{0,61}[a-z]))$/gi;
  if (domainPattern.test(input)) return true;
  else return false;
};

/*  
    DEFINITION:   Verifies whether the given domain address is valid or not
    PARAMETERS:   1. input - user entered text in the search bar
*/
const renderError = (error) => {
  const errorMarkup = `<h2 class='error txt-center'>${error}</h2>`;
  details.classList.contains('hidden') || details.classList.add('hidden');
  mapView.innerHTML = '';
  mapView.insertAdjacentHTML('beforeend', errorMarkup);
};

/*  
    DEFINITION:   Loads the current location of the user based on the ip
    PARAMETERS:   1. url - API endpoint from which the data will be retrieved
*/

const renderMap = async function (url) {
  const data = await getJsonData(url);
  let lat = data.location.lat;
  let lng = data.location.lng;
  console.log(lat, lng);
  mapView.innerHTML = `<div id='map'></div>`;
  const map = L.map('map').setView([lat, lng], 15);
  const markerIcon = L.icon({
    iconUrl: './src/images/icon-location.svg',
  });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  L.marker([lat, lng], { icon: markerIcon }).addTo(map);

  populateDetails(data);
};

/*  
    DEFINITION:   Loads the ip address, isp, location and timezone
    PARAMETERS:   NIL
*/

const populateDetails = (data) => {
  details.classList.contains('hidden') && details.classList.remove('hidden');
  const markup = `
        <div class="details__item">
          <p class="details__label">IP Address</p>
          <p class="details__value">${data.ip}</p>
        </div>
        <div class="details__item">
          <p class="details__label">Location</p>
          <p class="details__value">${data.location.region}, ${data.location.city} ${data.location.postalCode}</p>
        </div>
        <div class="details__item">
          <p class="details__label">Timezone</p>
          <p class="details__value">UTC ${data.location.timezone}</p>
        </div>
        <div class="details__item">
          <p class="details__label">ISP</p>
          <p class="details__value">${data.isp}</p>
        </div>
  `;
  details.innerHTML = '';
  details.insertAdjacentHTML('beforeend', markup);
};

/*  
    DEFINITION:   Loads the ip address, isp, location and timezone
    PARAMETERS:   NIL
*/

const renderIPLocation = () => {
  const searchTerm = searchBar.value;

  if (isValidIP(searchTerm)) {
    renderMap(
      `https://geo.ipify.org/api/v1?apiKey=${apiKey}&ipAddress=${searchTerm}`
    );
  } else if (isValidDomain(searchTerm)) {
    renderMap(
      `https://geo.ipify.org/api/v1?apiKey=${apiKey}&domain=${searchTerm}`
    );
  } else {
    renderError(`Please enter a valid IP address or domain name`);
  }
};

details.classList.add('hidden');

renderMap(`https://geo.ipify.org/api/v1?apiKey=${apiKey}`);

//Event listeners

btnSearch.addEventListener('click', renderIPLocation);

searchBar.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') renderIPLocation();
});
