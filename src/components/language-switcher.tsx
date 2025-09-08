"use client";

import { Languages } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  return (
    <Button variant="outline" onClick={toggleLanguage} className="flex items-center gap-2">
      <Languages size={18} />
      <span className="hidden sm:inline">{language === 'en' ? 'हिन्दी' : 'English'}</span>
    </Button>
  );
}
