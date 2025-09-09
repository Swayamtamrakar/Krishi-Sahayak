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
  units: z.enum(['C', 'F']).default('C').describe('The temperature unit (Celsius or Fahrenheit).'),
});
export type WeatherForecastInput = z.infer<typeof WeatherForecastInputSchema>;

const CurrentWeatherSchema = z.object({
    temp: z.number().describe("The current temperature."),
    condition: z.string().describe("A brief description of the current weather (e.g., 'Thundershower')."),
    precipitation: z.number().describe("The precipitation percentage."),
    humidity: z.number().describe("The humidity percentage."),
    windSpeed: z.number().describe("The wind speed in km/h."),
    conditionIcon: z.enum(['sunny', 'cloudy', 'rainy', 'windy', 'stormy', 'snowy', 'partly-cloudy', 'thundershower']).describe("The icon representing the current weather condition."),
});

const HourlyForecastSchema = z.object({
    time: z.string().describe("The time for the forecast entry (e.g., '4 pm', '7 pm', '10 pm', '1 am')."),
    temp: z.number().describe("The temperature at that hour."),
    precipitation: z.number().describe("The precipitation percentage at that hour."),
    windSpeed: z.number().describe("The wind speed in km/h at that hour."),
});

const DailyForecastSchema = z.object({
    day: z.string().describe("The abbreviated day of the week (e.g., 'Tue', 'Wed')."),
    highTemp: z.number().describe("The high temperature for the day."),
    lowTemp: z.number().describe("The low temperature for the day."),
    conditionIcon: z.enum(['sunny', 'cloudy', 'rainy', 'windy', 'stormy', 'snowy', 'partly-cloudy', 'thundershower']).describe("The icon representing the weather condition for the day."),
    hourly: z.array(HourlyForecastSchema).length(8).describe("An array of the 8-hour forecast for this specific day (every 3 hours) with temperature, precipitation, and wind speed."),
});

const WeatherForecastOutputSchema = z.object({
  current: CurrentWeatherSchema,
  daily: z.array(DailyForecastSchema).length(8).describe("An array of the 8-day weather forecast."),
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
