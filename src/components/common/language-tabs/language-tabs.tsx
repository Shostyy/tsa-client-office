"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";

const LanguageTabs = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
  };

  const currentLang = i18n.language.startsWith("uk") ? "uk" : "en";

  return (
    <Tabs
      value={currentLang}
      onValueChange={handleLanguageChange}
      className="w-auto"
    >
      <TabsList className="bg-white/10 backdrop-blur-sm">
        <TabsTrigger
          value="uk"
          className="data-[state=active]:bg-white/90 data-[state=active]:text-gray-900 data-[state=inactive]:text-white/70"
        >
          UA
        </TabsTrigger>
        <TabsTrigger
          value="en"
          className="data-[state=active]:bg-white/90 data-[state=active]:text-gray-900 data-[state=inactive]:text-white/70"
        >
          EN
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default LanguageTabs;
