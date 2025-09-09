"use client";

import { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, MapPin, AlertCircle, LocateFixed, Wind, Snowflake, CloudLightning } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '../ui/skeleton';
import { getWeatherForecast, WeatherForecastOutput } from '@/ai/flows/weather-forecast';
import { useToast } from '@/hooks/use-toast';

type DailyForecast = {
    day: string;
    temp: number;
    condition: "sunny" | "cloudy" | "rainy" | "windy" | "stormy" | "snowy";
};


const WeatherIcon = ({ condition, className }: { condition: DailyForecast['condition'], className?: string }) => {
  switch (condition) {
    case 'sunny':
      return <Sun className={className} />;
    case 'cloudy':
      return <Cloud className={className} />;
    case 'rainy':
      return <CloudRain className={className} />;
    case 'windy':
        return <Wind className={className} />;
    case 'stormy':
        return <CloudLightning className={className} />;
    case 'snowy':
        return <Snowflake className={className} />;
    default:
      return <Sun className={className} />;
  }
};

export function WeatherForecast() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [location, setLocation] = useState<{ latitude: number, longitude: number } | null>(null);
  const [weatherData, setWeatherData] = useState<DailyForecast[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        (geoError) => {
          setError(t('weather_location_error'));
          setLoading(false);
        }
      );
    } else {
      setError(t('weather_geolocation_unsupported'));
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    const fetchWeather = async () => {
        if (!location) return;
        
        try {
            setLoading(true);
            const result: WeatherForecastOutput = await getWeatherForecast(location);
            setWeatherData(result.forecast);
            setError(null);
        } catch (apiError) {
            console.error("Error fetching weather forecast:", apiError);
            toast({
                variant: "destructive",
                title: t('error_title'),
                description: t('weather_api_error'),
            });
            setError(t('weather_api_error'));
        } finally {
            setLoading(false);
        }
    }

    if (location) {
        fetchWeather();
    }
  }, [location, t, toast]);


  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <MapPin className="text-primary" />
          {t('weather_title')}
        </CardTitle>
        <CardDescription className="flex items-center gap-1">
            <LocateFixed size={14}/>
            {loading && !error && t('weather_loading_location')}
            {location && `${t('weather_subtitle')} Lat: ${location.latitude.toFixed(2)}, Lon: ${location.longitude.toFixed(2)}`}
            {error && !location && t('weather_subtitle_error')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex justify-between gap-4">
            {[...Array(7)].map((_, i) => <Skeleton key={i} className="w-16 h-24" />)}
          </div>
        )}
        {error && !loading &&(
            <div className="flex flex-col items-center justify-center h-24 text-destructive">
                <AlertCircle className="w-8 h-8 mb-2" />
                <p className="text-center">{error}</p>
            </div>
        )}
        {!loading && weatherData && (
          <div className="grid grid-cols-7 gap-2 text-center">
            {weatherData.map((weather) => (
              <div key={weather.day} className="flex flex-col items-center p-2 rounded-lg bg-background hover:bg-secondary transition-colors">
                <p className="font-semibold text-sm">{t(`day_${weather.day.toLowerCase()}` as any)}</p>
                <WeatherIcon condition={weather.condition} className="w-8 h-8 my-2 text-accent" />
                <p className="font-bold">{weather.temp}°C</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
