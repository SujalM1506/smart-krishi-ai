import axios from "axios";

export async function getWeather(city: string) {
  const res = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=YOUR_API_KEY`
  );

  return res.data;
}