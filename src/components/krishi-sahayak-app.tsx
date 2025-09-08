"use client";

import { CropRecommendation } from "@/components/features/crop-recommendation";
import { DiseaseDetection } from "@/components/features/disease-detection";
import { MandiPrices } from "@/components/features/mandi-prices";
import { WeatherForecast } from "@/components/features/weather-forecast";
import { Header } from "@/components/layout/header";
import { useLanguage } from "@/contexts/language-context";

export function KrishiSahayakApp() {
    const { t } = useLanguage();

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold font-headline text-foreground">
                        {t('appName')}
                    </h1>
                    <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
                        {t('appSubtitle')}
                    </p>
                </div>

                <div className="mb-8">
                    <WeatherForecast />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 items-start">
                    <CropRecommendation />
                    <DiseaseDetection />
                </div>

                <div className="mt-8">
                    <MandiPrices />
                </div>
            </main>
            <footer className="text-center p-4 text-muted-foreground text-sm">
                © {new Date().getFullYear()} {t('appName')}. {t('footer_rights')}
            </footer>
        </div>
    );
}
