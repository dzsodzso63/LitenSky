export type TimeOfDay = 'night' | 'sunrise' | 'day' | 'sunset';

export type City = {
  name: string;
  latitude: number;
  longitude: number;
  timezone?: string;
};

export type RecentCity = City & {
  cityImage?: string | null;
};

export type WeatherValues = {
  altimeterSetting: number;
  cloudBase: number;
  cloudCeiling: number;
  cloudCover: number;
  dewPoint: number;
  freezingRainIntensity: number;
  humidity: number;
  precipitationProbability: number;
  pressureSeaLevel: number;
  pressureSurfaceLevel: number;
  rainIntensity: number;
  sleetIntensity: number;
  snowIntensity: number;
  temperature: number;
  temperatureApparent: number;
  uvHealthConcern: number;
  uvIndex: number;
  visibility: number;
  weatherCode: number;
  windDirection: number;
  windGust: number;
  windSpeed: number;
};

export type WeatherData = {
  data: {
    time: string;
    values: WeatherValues;
  };
  location: {
    lat: number;
    lon: number;
  };
};

export type CityWeather = {
  city: City;
  cityImage: string | null;
  weatherData: WeatherData | null;
  timeOfDay: TimeOfDay;
  isLoading: boolean;
  isCurrent?: boolean;
};
