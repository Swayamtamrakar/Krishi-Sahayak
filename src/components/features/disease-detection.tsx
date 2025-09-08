"use client";

import { useState, useRef, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { Upload, Mic, X, Bot, Volume2, Sparkles, AlertTriangle } from "lucide-react";
import { detectDisease, DetectDiseaseOutput } from "@/ai/flows/ai-disease-detection";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";
import { Skeleton } from "../ui/skeleton";

export function DiseaseDetection() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DetectDiseaseOutput | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isListening, transcript, startListening, stopListening } = useSpeechRecognition({
    onResult: (text) => {
      form.setValue('symptoms', text);
    },
    onError: (error) => {
      toast({ variant: 'destructive', title: t('error_title'), description: error });
    }
  });

  const { isSpeaking, speak, cancel } = useSpeechSynthesis();

  const formSchema = z.object({
    symptoms: z.string().min(10, { message: t('disease_symptoms_validation') }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symptoms: "",
    },
  });

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        toast({
          variant: "destructive",
          title: t('error_title'),
          description: t('disease_image_size_error'),
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setImageDataUri(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!imageDataUri) {
      toast({
        variant: "destructive",
        title: t('error_title'),
        description: t('disease_image_upload_error'),
      });
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const response = await detectDisease({
        photoDataUri: imageDataUri,
        symptoms: values.symptoms,
      });
      setResult(response);
    } catch (error) {
      console.error("Error fetching disease detection:", error);
      toast({
        variant: "destructive",
        title: t('error_title'),
        description: t('disease_detection_error'),
      });
    } finally {
      setLoading(false);
    }
  }

  const handleSpeak = () => {
    if (isSpeaking) {
      cancel();
    } else if (result) {
      const textToSpeak = `${t('disease_causes_title')}: ${result.potentialCauses}. ${t('disease_solutions_title')}: ${result.suggestedSolutions}`;
      speak({ text: textToSpeak, lang: language === 'en' ? 'en-US' : 'hi-IN' });
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Bot className="text-primary" />
          {t('disease_detection_title')}
        </CardTitle>
        <CardDescription>{t('disease_detection_subtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormItem>
              <FormLabel>{t('disease_image_label')}</FormLabel>
              <FormControl>
                <div
                  className="relative flex justify-center items-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/*"
                  />
                  {imagePreview ? (
                    <>
                      <Image src={imagePreview} alt="Crop preview" fill style={{ objectFit: 'contain' }} className="rounded-lg p-2" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-7 w-7"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImagePreview(null);
                          setImageDataUri(null);
                          if(fileInputRef.current) fileInputRef.current.value = "";
                        }}
                      >
                        <X size={16} />
                      </Button>
                    </>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <Upload size={32} className="mx-auto mb-2" />
                      <p>{t('disease_image_placeholder')}</p>
                    </div>
                  )}
                </div>
              </FormControl>
            </FormItem>

            <FormField
              control={form.control}
              name="symptoms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('disease_symptoms_label')}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Textarea
                        placeholder={t('disease_symptoms_placeholder')}
                        className="pr-10"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className={`absolute top-1/2 -translate-y-1/2 right-1 h-8 w-8 ${isListening ? 'text-destructive' : ''}`}
                        onClick={() => isListening ? stopListening() : startListening(language === 'en' ? 'en-US' : 'hi-IN')}
                      >
                        <Mic size={18} />
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              {loading ? t('loading_button') : t('disease_analyze_button')}
            </Button>
          </form>
        </Form>

        {loading && (
          <div className="mt-6 space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        )}

        {result && (
          <div className="mt-6 space-y-4">
             <div className="flex justify-between items-center">
                <h3 className="font-semibold font-headline">{t('disease_results_title')}</h3>
                <Button variant="outline" size="icon" onClick={handleSpeak} disabled={!result}>
                    <Volume2 className={isSpeaking ? 'text-destructive' : ''} />
                </Button>
            </div>
            <Card className="bg-background">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-headline">
                  <AlertTriangle className="text-destructive" /> {t('disease_causes_title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{result.potentialCauses}</p>
              </CardContent>
            </Card>
            <Card className="bg-background">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-headline">
                  <Sparkles className="text-accent" /> {t('disease_solutions_title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{result.suggestedSolutions}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
