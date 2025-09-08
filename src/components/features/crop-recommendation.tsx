"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Leaf, Bot, ListTree, AreaChart } from "lucide-react";
import { recommendCrops, AICropRecommendationOutput, AICropRecommendationInput } from "@/ai/flows/ai-crop-recommendation";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "../ui/skeleton";

export function CropRecommendation() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<AICropRecommendationOutput | null>(null);

  const formSchema = z.object({
    soilType: z.string().min(2, { message: t('crop_rec_soil_validation') }),
    area: z.coerce.number().positive({ message: t('crop_rec_area_validation') }),
    previousCrop: z.string().min(2, { message: t('crop_rec_prev_crop_validation') }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      soilType: "",
      area: undefined,
      previousCrop: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setRecommendation(null);
    try {
      const result = await recommendCrops(values as AICropRecommendationInput);
      setRecommendation(result);
    } catch (error) {
      console.error("Error fetching crop recommendations:", error);
      toast({
        variant: "destructive",
        title: t('error_title'),
        description: t('crop_rec_error'),
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <ListTree className="text-primary" />
          {t('crop_rec_title')}
        </CardTitle>
        <CardDescription>{t('crop_rec_subtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="soilType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('crop_rec_soil_label')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('crop_rec_soil_placeholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('crop_rec_area_label')}</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder={t('crop_rec_area_placeholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="previousCrop"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('crop_rec_prev_crop_label')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('crop_rec_prev_crop_placeholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              {loading ? t('loading_button') : t('crop_rec_button')}
            </Button>
          </form>
        </Form>
        
        {loading && (
           <div className="mt-6 space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
           </div>
        )}

        {recommendation && (
          <div className="mt-6 space-y-4">
            <h3 className="font-semibold font-headline">{t('crop_rec_results_title')}</h3>
            {recommendation.crops.map((crop, index) => (
              <Card key={index} className="bg-background">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between font-headline">
                    <span className="flex items-center gap-2"><Leaf size={20} /> {crop.name}</span>
                    <span className="text-sm font-medium text-primary">{crop.suitabilityScore} / 100</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{crop.rationale}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
