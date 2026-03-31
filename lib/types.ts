export type AppLanguage = 'uz' | 'ru' | 'en';

export type PollutionComplaint = {
  id: number;
  author: string;
  district: string;
  upvotes: number;
  note: string;
  lat: number;
  lng: number;
};

export type AqiReading = {
  city: string;
  aqi: number;
  updatedAt: string;
  pm25: number;
  pm10: number;
};
