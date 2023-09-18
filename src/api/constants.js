const url = 'https://api.weatherapi.com/v1/'; //URL de la API
const key = '?key=67a586e6a18049f395f162629231509'; //Key 
const current = 'current.json';
const forecast = 'forecast.json';
const search = 'search.json';

export const dataByDay = `${url}${current}${key}`;
export const dataByWeek = `${url}${forecast}${key}`;
export const searchData = `${url}${search}${key}`;

