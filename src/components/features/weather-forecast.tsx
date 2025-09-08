"use client";

import { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, MapPin, Loader, AlertCircle, LocateFixed } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '../ui/skeleton';

const mockWeatherData = [
  { day: 'Mon', temp: 28, condition: 'sunny' },
  { day: 'Tue', temp: 30, condition: 'sunny' },
  { day: 'Wed', temp: 25, condition: 'rainy' },
  { day: 'Thu', temp: 27, condition: 'cloudy' },
  { day: 'Fri', temp: 32, condition: 'sunny' },
  { day: 'Sat', temp: 29, condition: 'cloudy' },
  { day: 'Sun', temp: 26, condition: 'rainy' },
];

const WeatherIcon = ({ condition, className }: { condition: string, className?: string }) => {
  switch (condition) {
    case 'sunny':
      return <Sun className={className} />;
    case 'cloudy':
      return <Cloud className={className} />;
    case 'rainy':
      return <CloudRain className={className} />;
    default:
      return <Sun className={className} />;
  }
};

export function WeatherForecast() {
  const { t } = useLanguage();
  const [location, setLocation] = useState<{ latitude: number, longitude: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          setLoading(false);
        },
        (error) => {
          setError(t('weather_location_error'));
          setLoading(false);
        }
      );
    } else {
      setError(t('weather_geolocation_unsupported'));
      setLoading(false);
    }
  }, [t]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <MapPin className="text-primary" />
          {t('weather_title')}
        </CardTitle>
        <CardDescription className="flex items-center gap-1">
            <LocateFixed size={14}/>
            {loading && t('weather_loading_location')}
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
        {error && (
            <div className="flex flex-col items-center justify-center h-24 text-destructive">
                <AlertCircle className="w-8 h-8 mb-2" />
                <p className="text-center">{error}</p>
            </div>
        )}
        {!loading && !error && (
          <div className="grid grid-cols-7 gap-2 text-center">
            {mockWeatherData.map((weather) => (
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
