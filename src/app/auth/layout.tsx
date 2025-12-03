"use client";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/common";
import LanguageTabs from "@/components/common/language-tabs/language-tabs";
import { useTranslation } from "react-i18next";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation();

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden lg:flex-row">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm dark:hidden"
        style={{
          backgroundImage: "url('/slider/light-slide.jpg')",
        }}
      />

      <div
        className="absolute inset-0 hidden bg-cover bg-center bg-no-repeat blur-sm dark:block"
        style={{
          backgroundImage: "url('/slider/dark-slide.jpg')",
        }}
      />

      <div className="absolute inset-0 bg-black/20 dark:bg-black/40" />

      <div className="relative z-10 flex justify-center pt-8 lg:hidden">
        <div className="relative h-16 w-40">
          <Image
            src="/logo/logo-dark.svg"
            alt="Logo"
            width={232}
            height={81}
            className="object-contain dark:hidden"
          />
          <Image
            src="/logo/logo-light.svg"
            alt="Logo"
            width={232}
            height={81}
            className="hidden object-contain dark:block"
          />
        </div>
      </div>

      <div className="relative z-10 hidden w-[60%] flex-col justify-between p-12 lg:flex xl:p-16">
        <div className="relative h-24 w-48 xl:h-28 xl:w-56">
          <Image
            src="/logo/logo-dark.svg"
            alt="Logo"
            width={232}
            height={81}
            className="object-contain dark:hidden"
          />
          <Image
            src="/logo/logo-light.svg"
            alt="Logo"
            width={232}
            height={81}
            className="hidden object-contain dark:block"
          />
        </div>

        <div className="max-w-xl">
          <h2 className="text-2xl font-medium text-white/90 drop-shadow-lg xl:text-3xl">
            {t("Auth.Slogan")}
          </h2>
        </div>

        <div />
      </div>

      {/* Right side - auth form */}
      <div className="relative z-10 flex w-full flex-1 items-center justify-center p-4 lg:w-[40%] lg:p-0">
        <div className="flex w-full items-center justify-center">
          <Card className="w-full max-w-md border-white/20 bg-white/10 shadow-2xl backdrop-blur-md">
            <CardContent className="p-6 md:p-8 lg:p-10">
              {/* Header with Language and Theme */}
              <div className="mb-6 flex items-center justify-between">
                {/* Language Selector using Tabs */}
                <LanguageTabs />
                {/* Theme Toggle */}
                <ThemeToggle />
              </div>

              {/* Form Content */}
              {children}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile slogan - bottom */}
      <div className="relative z-10 pb-8 text-center lg:hidden">
        <h2 className="px-4 text-lg font-medium text-white/90 drop-shadow-lg">
          Ми завжди поруч з нашими клієнтами
        </h2>
      </div>
    </div>
  );
}
