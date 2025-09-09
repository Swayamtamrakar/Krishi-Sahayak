"use client";

import { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, LocateFixed, Wind, Snowflake, CloudLightning, CloudSun, Droplets, Thermometer } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from '@/contexts/language-context';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '../ui/skeleton';
import { getWeatherForecast, WeatherForecastOutput } from '@/ai/flows/weather-forecast';
import { useToast } from '@/hooks/use-toast';
import { Button } from '../ui/button';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';


type ConditionIcon = WeatherForecastOutput['daily'][0]['conditionIcon'];

const weatherIconMap: Record<ConditionIcon, React.ComponentType<{ className?: string }>> = {
    'sunny': Sun,
    'cloudy': Cloud,
    'rainy': CloudRain,
    'windy': Wind,
    'stormy': CloudLightning,
    'snowy': Snowflake,
    'partly-cloudy': CloudSun,
    'thundershower': CloudLightning,
};

const WeatherIcon = ({ condition, className }: { condition: ConditionIcon, className?: string }) => {
  const IconComponent = weatherIconMap[condition] || Sun;
  return <IconComponent className={className} />;
};

export function WeatherForecast() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [location, setLocation] = useState<{ latitude: number, longitude: number } | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherForecastOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [units, setUnits] = useState<'C' | 'F'>('C');

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
            const result: WeatherForecastOutput = await getWeatherForecast({ ...location, units });
            setWeatherData(result);
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
  }, [location, t, toast, units]);
  
  if (loading) {
    return (
        <Card className="bg-secondary/50 p-6">
            <div className="flex justify-between items-center mb-4">
                <Skeleton className="h-8 w-1/4" />
                <Skeleton className="h-8 w-1/4" />
            </div>
            <Skeleton className="h-48 w-full" />
            <div className="flex justify-between mt-4">
                {[...Array(8)].map((_, i) => <Skeleton key={i} className="w-16 h-24" />)}
            </div>
        </Card>
    );
  }

  if (error || !weatherData) {
      return (
           <Card className="bg-secondary/50 p-6 text-center">
                <p className="text-destructive">{error || t('weather_api_error')}</p>
           </Card>
      )
  }

  const { current, hourly, daily } = weatherData;

  return (
    <Card className="bg-secondary/50 p-4 sm:p-6 text-foreground">
        <CardContent className="p-0">
            {/* Top section */}
            <div className="flex flex-col md:flex-row justify-between items-start mb-6">
                <div className="flex items-start">
                    <WeatherIcon condition={current.conditionIcon} className="w-20 h-20 sm:w-24 sm:h-24 text-primary mr-4" />
                    <div>
                        <div className="flex items-baseline">
                            <h2 className="text-5xl sm:text-6xl font-bold">{current.temp}</h2>
                            <div className="flex items-center text-2xl sm:text-3xl font-medium ml-1">
                                <button onClick={() => setUnits('C')} className={`${units === 'C' ? 'text-foreground' : 'text-muted-foreground'}`}>°C</button>
                                <span className="mx-1 text-muted-foreground">|</span>
                                <button onClick={() => setUnits('F')} className={`${units === 'F' ? 'text-foreground' : 'text-muted-foreground'}`}>°F</button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-muted-foreground mt-2">
                           <p>Precipitation: {current.precipitation}%</p>
                           <p>Humidity: {current.humidity}%</p>
                           <p>Wind: {current.windSpeed} km/h</p>
                        </div>
                    </div>
                </div>
                <div className="text-right mt-4 md:mt-0">
                    <h3 className="text-2xl font-bold">Weather</h3>
                    <p className="text-muted-foreground">{current.day}</p>
                    <p className="text-muted-foreground">{current.condition}</p>
                </div>
            </div>

            {/* Chart and Tabs */}
            <div className='mb-6'>
                <Tabs defaultValue="temperature">
                    <TabsList className="mb-4">
                        <TabsTrigger value="temperature">Temperature</TabsTrigger>
                        <TabsTrigger value="precipitation" disabled>Precipitation</TabsTrigger>
                        <TabsTrigger value="wind" disabled>Wind</TabsTrigger>
                    </TabsList>
                </Tabs>
                <ChartContainer config={{}} className="h-40 w-full">
                   <ResponsiveContainer>
                    <LineChart data={hourly} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)"/>
                        <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                        <YAxis hide={true} domain={['dataMin - 2', 'dataMax + 2']} />
                        <ChartTooltip 
                           cursor={{stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: "5 5"}}
                           content={<ChartTooltipContent 
                                indicator='dot'
                                labelKey='temp'
                                hideLabel={true}
                                formatter={(value, name, props) => (
                                    <div className="flex flex-col items-center">
                                        <span className="font-bold text-foreground">{props.payload?.temp}°{units}</span>
                                        <span className="text-xs text-muted-foreground">{props.payload?.time}</span>
                                    </div>
                                )}
                            />}
                         />
                        <Line type="monotone" dataKey="temp" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                    </LineChart>
                   </ResponsiveContainer>
                </ChartContainer>
            </div>
            
            {/* Daily Forecast */}
            <div className="grid grid-cols-4 md:grid-cols-8 gap-2 text-center">
                {daily.map((day, index) => (
                    <Button key={index} variant="ghost" className="flex flex-col h-auto p-2 items-center justify-between bg-transparent hover:bg-accent rounded-lg transition-colors">
                        <p className="font-semibold text-sm">{t(`day_${day.day.toLowerCase()}` as any, day.day)}</p>
                        <WeatherIcon condition={day.conditionIcon} className="w-8 h-8 my-2 text-primary" />
                        <p className="font-bold text-sm">{day.highTemp}° <span className="text-muted-foreground">{day.lowTemp}°</span></p>
                    </Button>
                ))}
            </div>
             <div className="text-center mt-6 text-xs text-muted-foreground">
                <a href="#" className="hover:text-primary">Google Weather</a> &bull; <a href="#" className="hover:text-primary">Feedback</a>
            </div>
        </CardContent>
    </Card>
  );
}
