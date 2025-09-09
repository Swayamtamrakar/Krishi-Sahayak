'use server';

/**
 * @fileOverview A weather forecast AI agent.
 *
 * - getWeatherForecast - A function that handles the weather forecast process.
 * - WeatherForecastInput - The input type for the getWeatherForecast function.
 * - WeatherForecastOutput - The return type for the getWeatherForecast function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WeatherForecastInputSchema = z.object({
  latitude: z.number().describe('The latitude for the forecast.'),
  longitude: z.number().describe('The longitude for the forecast.'),
  units: z.enum(['C', 'F']).default('C').describe('The temperature unit (C or F).'),
});
export type WeatherForecastInput = z.infer<typeof WeatherForecastInputSchema>;

const CurrentWeatherSchema = z.object({
    temp: z.number().describe("Current temperature."),
    condition: z.string().describe("Brief description (e.g., 'Thundershower')."),
    precipitation: z.number().describe("Precipitation percentage."),
    humidity: z.number().describe("Humidity percentage."),
    windSpeed: z.number().describe("Wind speed in km/h."),
    conditionIcon: z.enum(['sunny', 'cloudy', 'rainy', 'windy', 'stormy', 'snowy', 'partly-cloudy', 'thundershower']).describe("Icon for the current condition."),
});

const HourlyForecastSchema = z.object({
    time: z.string().describe("Time for the forecast (e.g., '4 pm')."),
    temp: z.number().describe("Temperature at that hour."),
    precipitation: z.number().describe("Precipitation percentage."),
    windSpeed: z.number().describe("Wind speed in km/h."),
});

const DailyForecastSchema = z.object({
    day: z.string().describe("Abbreviated day (e.g., 'Tue')."),
    highTemp: z.number().describe("High temperature."),
    lowTemp: z.number().describe("Low temperature."),
    conditionIcon: z.enum(['sunny', 'cloudy', 'rainy', 'windy', 'stormy', 'snowy', 'partly-cloudy', 'thundershower']).describe("Icon for the day's condition."),
    hourly: z.array(HourlyForecastSchema).describe("8-hour forecast for this day (every 3 hours)."),
});

const WeatherForecastOutputSchema = z.object({
  current: CurrentWeatherSchema,
  daily: z.array(DailyForecastSchema).describe("8-day weather forecast."),
});
export type WeatherForecastOutput = z.infer<typeof WeatherForecastOutputSchema>;


export async function getWeatherForecast(input: WeatherForecastInput): Promise<WeatherForecastOutput> {
  return weatherForecastFlow(input);
}

const prompt = ai.definePrompt({
  name: 'weatherForecastPrompt',
  input: {schema: WeatherForecastInputSchema},
  output: {schema: WeatherForecastOutputSchema},
  prompt: `You are a weather forecaster using Google's weather models. Provide an accurate and detailed weather forecast for the given location and temperature unit.

Latitude: {{{latitude}}}
Longitude: {{{longitude}}}
Units: {{{units}}}

Return the forecast as a JSON object with the following structure:
- 'current': Current weather conditions (temp, condition, precipitation, humidity, windSpeed, conditionIcon).
- 'daily': An 8-day forecast array. Each day should include 'day' (abbreviated), 'highTemp', 'lowTemp', 'conditionIcon', and a nested 'hourly' array.
- The nested 'hourly' array for each day should contain an 8-entry forecast for that day (in 3-hour intervals) with 'time', 'temp', 'precipitation', and 'windSpeed'.

Use the following icon names for 'conditionIcon': 'sunny', 'cloudy', 'rainy', 'windy', 'stormy', 'snowy', 'partly-cloudy', 'thundershower'.
`,
});

const weatherForecastFlow = ai.defineFlow(
  {
    name: 'weatherForecastFlow',
    inputSchema: WeatherForecastInputSchema,
    outputSchema: WeatherForecastOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
