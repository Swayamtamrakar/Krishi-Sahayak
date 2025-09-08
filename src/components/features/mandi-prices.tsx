"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const mockData = {
  wheat: [
    { name: 'Jan', price: 2100, demand: 5000 },
    { name: 'Feb', price: 2150, demand: 5200 },
    { name: 'Mar', price: 2200, demand: 5500 },
    { name: 'Apr', price: 2250, demand: 6000 },
    { name: 'May', price: 2300, demand: 5800 },
    { name: 'Jun', price: 2280, demand: 5600 },
  ],
  rice: [
    { name: 'Jan', price: 3500, demand: 7000 },
    { name: 'Feb', price: 3550, demand: 7200 },
    { name: 'Mar', price: 3600, demand: 7500 },
    { name: 'Apr', price: 3650, demand: 8000 },
    { name: 'May', price: 3700, demand: 7800 },
    { name: 'Jun', price: 3680, demand: 7600 },
  ],
  cotton: [
    { name: 'Jan', price: 6000, demand: 4000 },
    { name: 'Feb', price: 6100, demand: 4200 },
    { name: 'Mar', price: 6200, demand: 4500 },
    { name: 'Apr', price: 6300, demand: 5000 },
    { name: 'May', price: 6400, demand: 4800 },
    { name: 'Jun', price: 6350, demand: 4600 },
  ],
};

const chartConfig = {
  price: {
    label: "Price",
    color: "hsl(var(--primary))",
  },
  demand: {
    label: "Demand (tons)",
    color: "hsl(var(--accent))",
  },
};

export function MandiPrices() {
  const { t } = useLanguage();
  const [selectedCrop, setSelectedCrop] = useState<"wheat" | "rice" | "cotton">("wheat");

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
                <CardTitle className="flex items-center gap-2 font-headline">
                    <TrendingUp className="text-primary" />
                    {t('mandi_prices_title')}
                </CardTitle>
                <CardDescription>{t('mandi_prices_subtitle')}</CardDescription>
            </div>
            <Select onValueChange={(value: "wheat" | "rice" | "cotton") => setSelectedCrop(value)} defaultValue={selectedCrop}>
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder={t('mandi_select_crop_placeholder')} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="wheat">{t('crop_wheat')}</SelectItem>
                    <SelectItem value="rice">{t('crop_rice')}</SelectItem>
                    <SelectItem value="cotton">{t('crop_cotton')}</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer>
                <BarChart data={mockData[selectedCrop]}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                    <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--primary))" />
                    <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--accent))" />
                    <ChartTooltip 
                        cursor={false}
                        content={<ChartTooltipContent indicator="dot" />}
                    />
                    <Legend />
                    <Bar dataKey="price" fill="var(--color-price)" radius={4} yAxisId="left" />
                    <Bar dataKey="demand" fill="var(--color-demand)" radius={4} yAxisId="right" />
                </BarChart>
            </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
