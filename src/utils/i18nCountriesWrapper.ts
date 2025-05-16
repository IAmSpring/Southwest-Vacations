/**
 * This is a wrapper around i18n-iso-countries to make it work with ESM.
 * The original library uses CommonJS-style require() which doesn't work in Vite/ESM.
 */

// Import all countries data directly
import * as countriesLib from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';

// Initialize with English locale
try {
  // @ts-expect-error - the type definitions aren't perfect for this library
  countriesLib.registerLocale(enLocale);
} catch (error) {
  console.error('Error registering locale:', error);
}

/**
 * Export wrapped functions that are safe to use
 */
export const registerLocale = (locale: any) => {
  try {
    // @ts-expect-error - registerLocale exists but TypeScript doesn't recognize it
    countriesLib.registerLocale(locale);
  } catch (error) {
    console.error('Error registering locale:', error);
  }
};

export const getNames = (lang: string, options?: any) => {
  try {
    // @ts-expect-error - getNames exists but TypeScript doesn't recognize it
    return countriesLib.getNames(lang, options);
  } catch (error) {
    console.error('Error getting country names:', error);
    return {};
  }
};

export const getName = (code: string, lang: string) => {
  try {
    // @ts-expect-error - getName exists but TypeScript doesn't recognize it
    return countriesLib.getName(code, lang);
  } catch (error) {
    console.error('Error getting country name:', error);
    return '';
  }
};

export const getAlpha2Code = (name: string, lang: string) => {
  try {
    // @ts-expect-error - getAlpha2Code exists but TypeScript doesn't recognize it
    return countriesLib.getAlpha2Code(name, lang);
  } catch (error) {
    console.error('Error getting alpha2 code:', error);
    return '';
  }
};

// Export the module as default
const i18nCountries = {
  registerLocale,
  getNames,
  getName,
  getAlpha2Code,
};

export default i18nCountries;
