export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const city = searchParams.get("city");

    if (!city) {
      return Response.json({
        success: false,
        error: "City is required",
      });
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    const data = await response.json();

    if (data.cod !== 200) {
      return Response.json({
        success: false,
        error: data.message,
      });
    }

    return Response.json({
      success: true,
      city: data.name,
      temperature: data.main.temp,
      humidity: data.main.humidity,
      weather: data.weather[0].main,
      description: data.weather[0].description,
      windSpeed: data.wind.speed,
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: String(error),
    });
  }
}