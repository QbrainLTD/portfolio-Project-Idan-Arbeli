import { countries, search, reset } from "./countries.js";

const searchInput = document.querySelector("#search");
const cardsDiv = document.getElementById("cards");
const favoritesContainer = document.getElementById("favorites-container");
let favoriteCountries = JSON.parse(localStorage.getItem("favoriteCountries")) || [];

searchInput.addEventListener("keydown", (event) => {
  reset();
  cardsDiv.innerHTML = "";
  search(event.target.value.trim());
  createCardList();
});

const saveFavorites = () => {
  localStorage.setItem("favoriteCountries", JSON.stringify(favoriteCountries));
};

export const createCard = (country) => {
  if (!country || !country.name || !country.flags) return;

  const card = document.createElement("div");
  card.className = "card shadow-lg m-2 col-md-3 col-sm-12";

  const cardImg = document.createElement("img");
  cardImg.className = "card-img-top mt-2 border-rounded";
  cardImg.src = country.flags.png;

  const cardBody = document.createElement("div");
  cardBody.className = "card-body";

  const cardTitle = document.createElement("h5");
  cardTitle.className = "card-title";
  cardTitle.textContent = country.name.common;

  const population = document.createElement("p");
  population.className = "card-text";
  population.innerHTML = `<strong>Population:</strong> ${country.population.toLocaleString()}`;

  const capital = document.createElement("p");
  capital.className = "card-text";
  capital.innerHTML = `<strong>Capital:</strong> ${country.capital}`;

  const languages = document.createElement("p");
  languages.className = "card-text";
  if (country.languages) {
    const languageNames = Object.values(country.languages);
    languages.innerHTML = `<strong>Languages:</strong> ${languageNames.join(', ')}`;
  } else {
    languages.textContent = `Languages: Not Available`;
  }

  const currencies = document.createElement("p");
  currencies.className = "card-text";
  if (country.currencies) {
    const currencyInfo = Object.values(country.currencies)
      .map(currency => `${currency.name} (${currency.symbol})`)
      .join(', ');
    currencies.innerHTML = `<strong>Currencies:</strong> ${currencyInfo}`;
  } else {
    currencies.textContent = `Currencies: Not Available`;
  }

  const cardFooter = document.createElement("div");
  cardFooter.className = "card-footer d-flex justify-content-center mb-2";

  const heart = document.createElement("i");
  heart.className = favoriteCountries.some(favCountry => favCountry.country && favCountry.country.name && favCountry.country.name.common === country.name.common)
    ? "bi bi-heart-fill"
    : "bi bi-heart";
  if (heart.className === "bi bi-heart-fill") {
    heart.style.color = favoriteCountries.find(favCountry => favCountry.country && favCountry.country.name && favCountry.country.name.common === country.name.common).color;
  }

  const map = document.createElement("i");
  map.className = "bi bi-map";
  map.style.paddingLeft = "8px";

  map.addEventListener("click", () => {
    const countryName = country.name.common;
    const mapUrl = `https://www.google.com/maps/search/${encodeURIComponent(countryName)}`;
    window.open(mapUrl, "MapWindow", "width=800,height=600,top=100,left=100");
  });

  heart.addEventListener("click", () => {
    if (heart.className === "bi bi-heart") {
      heart.className = "bi bi-heart-fill";
      heart.style.color = "red";
      favoriteCountries.push({
        country: country,
        color: "red"
      });
      addFavoriteCard(country);
    } else {
      heart.className = "bi bi-heart";
      heart.style.color = "";
      favoriteCountries = favoriteCountries.filter(favCountry => favCountry.country && favCountry.country.name && favCountry.country.name.common !== country.name.common);
      removeFavoriteCard(country.name.common);
    }
    saveFavorites();
  });

  card.appendChild(cardImg);
  cardBody.appendChild(cardTitle);
  cardBody.appendChild(population);
  cardBody.appendChild(capital);
  cardBody.appendChild(languages);
  cardBody.appendChild(currencies);
  cardFooter.appendChild(heart);
  cardFooter.appendChild(map);
  card.appendChild(cardBody);
  card.appendChild(cardFooter);
  cardsDiv.appendChild(card);
};

export const createCardList = () => {
  for (const country of countries) {
    createCard(country);
  }
};

const addFavoriteCard = (country) => {
  if (!country || !country.name || !country.flags) return;

  const favoriteCard = document.createElement("div");
  favoriteCard.className = "card shadow-lg m-2 col-md-3 col-sm-12";

  const cardImg = document.createElement("img");
  cardImg.className = "card-img-top mt-2 border-rounded";
  cardImg.src = country.flags.png;

  const cardBody = document.createElement("div");
  cardBody.className = "card-body";

  const cardTitle = document.createElement("h5");
  cardTitle.className = "card-title";
  cardTitle.textContent = country.name.common;

  const population = document.createElement("p");
  population.className = "card-text";
  population.innerHTML = `<strong>Population:</strong> ${country.population.toLocaleString()}`;

  const capital = document.createElement("p");
  capital.className = "card-text";
  capital.innerHTML = `<strong>Capital:</strong> ${country.capital}`;

  const languages = document.createElement("p");
  languages.className = "card-text";
  if (country.languages) {
    const languageNames = Object.values(country.languages);
    languages.innerHTML = `<strong>Languages:</strong> ${languageNames.join(', ')}`;
  } else {
    languages.textContent = `Languages: Not Available`;
  }

  const currencies = document.createElement("p");
  currencies.className = "card-text";
  if (country.currencies) {
    const currencyInfo = Object.values(country.currencies)
      .map(currency => `${currency.name} (${currency.symbol})`)
      .join(', ');
    currencies.innerHTML = `<strong>Currencies:</strong> ${currencyInfo}`;
  } else {
    currencies.textContent = `Currencies: Not Available`;
  }

  const cardFooter = document.createElement("div");
  cardFooter.className = "card-footer d-flex justify-content-center mb-2";

  const heart = document.createElement("i");
  heart.className = "bi bi-heart-fill";
  heart.style.color = "red";
  const map = document.createElement("i");
  map.className = "bi bi-map";
  map.style.paddingLeft = "8px";

  map.addEventListener("click", () => {
    const countryName = country.name.common;
    const mapUrl = `https://www.google.com/maps/search/${encodeURIComponent(countryName)}`;
    window.open(mapUrl, "MapWindow", "width=800,height=600,top=100,left=100");
  });

  heart.addEventListener("click", () => {
    heart.className = "bi bi-heart";
    heart.style.color = "";
    favoriteCountries = favoriteCountries.filter(favCountry => favCountry.country && favCountry.country.name && favCountry.country.name.common !== country.name.common);
    removeFavoriteCard(country.name.common);
    saveFavorites();
  });

  favoriteCard.appendChild(cardImg);
  cardBody.appendChild(cardTitle);
  cardBody.appendChild(population);
  cardBody.appendChild(capital);
  cardBody.appendChild(languages);
  cardBody.appendChild(currencies);
  cardFooter.appendChild(heart);
  cardFooter.appendChild(map);
  favoriteCard.appendChild(cardBody);
  favoriteCard.appendChild(cardFooter);
  favoritesContainer.appendChild(favoriteCard);
};

const removeFavoriteCard = (countryName) => {
  const favoriteCards = favoritesContainer.getElementsByClassName("card");
  for (let i = 0; i < favoriteCards.length; i++) {
    const cardTitle = favoriteCards[i].querySelector(".card-title").textContent;
    if (cardTitle === countryName) {
      favoritesContainer.removeChild(favoriteCards[i]);
      break;
    }
  }
};

const loadFavorites = () => {
  favoriteCountries.forEach(favCountryObj => {
    const { country } = favCountryObj;
    if (country && country.name && country.flags) {
      addFavoriteCard(country);
    }
  });
};

loadFavorites();
