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
});
export type WeatherForecastInput = z.infer<typeof WeatherForecastInputSchema>;

const DailyForecastSchema = z.object({
    day: z.string().describe("The day of the week (e.g., 'Mon', 'Tue')."),
    temp: z.number().describe('The average temperature in Celsius.'),
    condition: z.enum(['sunny', 'cloudy', 'rainy', 'windy', 'stormy', 'snowy']).describe("The general weather condition for the day."),
});

const WeatherForecastOutputSchema = z.object({
  forecast: z.array(DailyForecastSchema).length(7).describe('An array of the 7-day weather forecast.'),
});
export type WeatherForecastOutput = z.infer<typeof WeatherForecastOutputSchema>;


export async function getWeatherForecast(input: WeatherForecastInput): Promise<WeatherForecastOutput> {
  return weatherForecastFlow(input);
}

const prompt = ai.definePrompt({
  name: 'weatherForecastPrompt',
  input: {schema: WeatherForecastInputSchema},
  output: {schema: WeatherForecastOutputSchema},
  prompt: `You are a weather forecaster using Google's weather models. Provide an accurate 7-day weather forecast for the given location.

Latitude: {{{latitude}}}
Longitude: {{{longitude}}}

Return the forecast as a JSON object with a 'forecast' array, where each element represents a day and includes 'day', 'temp' (in Celsius), and 'condition' ('sunny', 'cloudy', 'rainy', 'windy', 'stormy', 'snowy').
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
