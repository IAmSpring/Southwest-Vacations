import { Country, State, City, ICountry, IState, ICity } from 'country-state-city';
import { countries } from 'countries-list';
import i18nCountries from '../utils/i18nCountriesWrapper';
import enLocale from 'i18n-iso-countries/langs/en.json';

// Initialize the i18n countries (this is now handled in the wrapper)
// i18nCountries.registerLocale(enLocale);

// Define Country type from countries-list
interface CountryListItem {
  name: string;
  native: string;
  phone: string;
  continent: string;
  capital: string;
  currency: string;
  languages: string[];
  emoji: string;
}

type CountryEntry = [string, any];

// Get all countries with names and ISO codes
export const allCountries = Object.entries(countries).map(([code, country]: CountryEntry) => ({
  code,
  name: country.name,
  emoji: country.emoji,
  capital: country.capital,
  continent: country.continent,
  phone: country.phone,
}));

// Get all country codes
export const allCountryCodes = Object.keys(countries);

// Function to get all countries with their complete data
export const getFullCountriesList = () => {
  return Country.getAllCountries().map((country: ICountry) => ({
    ...country,
    states: State.getStatesOfCountry(country.isoCode),
  }));
};

// Function to get all states/provinces for a country
export const getStatesForCountry = (countryCode: string) => {
  return State.getStatesOfCountry(countryCode);
};

// Function to get all cities for a country and state
export const getCitiesForState = (countryCode: string, stateCode: string) => {
  return City.getCitiesOfState(countryCode, stateCode);
};

// Function to get all cities for a country
export const getCitiesForCountry = (countryCode: string) => {
  const states = State.getStatesOfCountry(countryCode);
  let allCities: ICity[] = [];

  states.forEach((state: IState) => {
    const cities = City.getCitiesOfState(countryCode, state.isoCode);
    allCities = [...allCities, ...cities];
  });

  return allCities;
};

// Get counts for filtered lists
export const getLocationCounts = (items: any[], property: string, value: string) => {
  return items.filter(item => item[property] === value).length;
};

// Format location with count
export const formatLocationWithCount = (location: string, count: number) => {
  return `${location} (${count})`;
};

export default {
  allCountries,
  allCountryCodes,
  getFullCountriesList,
  getStatesForCountry,
  getCitiesForState,
  getCitiesForCountry,
  getLocationCounts,
  formatLocationWithCount,
};
