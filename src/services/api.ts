import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://lamongabriel-rocketshoes.netlify.app/api',
});
