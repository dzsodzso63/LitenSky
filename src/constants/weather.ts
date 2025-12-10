export const TOMORROW_API_KEY = import.meta.env.VITE_TOMORROW_API_KEY || '';

export const TOMORROW_API_BASE_URL = 'https://api.tomorrow.io/v4/weather/realtime';

export const TOMORROW_API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    'accept-encoding': 'deflate, gzip, br',
  },
};

