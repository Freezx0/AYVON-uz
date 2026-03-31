export const getAirStatus = (aqi: number) => {
  if (aqi < 50) return 'good';
  if (aqi <= 100) return 'moderate';
  return 'danger';
};

export const getMaskAdvice = (aqi: number) => {
  if (aqi < 50) return 'no';
  if (aqi <= 100) return 'optional';
  return 'yes';
};
