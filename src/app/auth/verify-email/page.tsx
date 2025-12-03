"use client";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useVerifyEmail } from "@/api/hooks";
import { AxiosError } from "axios";
import { useTranslation } from "react-i18next";

export default function VerifyEmailPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  const lang = searchParams.get("lang");

  const {
    mutate: verifyEmail,
    isPending,
    isError,
    isSuccess,
    error,
  } = useVerifyEmail();

  useEffect(() => {
    if (token && lang) {
      verifyEmail({ token, lang });
    }
  }, [lang, token, verifyEmail]);

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        router.push("/auth/login");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isSuccess, router]);

  if (!token || !lang) {
    return (
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {t("Auth.EmailVerification")}
          </h1>
        </div>

        <Alert
          variant="destructive"
          className="bg-red-500/20 border-red-500/50 text-white"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {t("Auth.IncorrectLinkForEmailReset")}
          </AlertDescription>
        </Alert>

        <Button
          onClick={() => router.push("/auth/login")}
          className="w-full bg-white text-gray-900 hover:bg-white/90"
          size="lg"
        >
          {t("Auth.GoBackToLogin")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          {t("Auth.EmailVerification")}
        </h1>
        <p className="text-sm text-white/80">
          {isPending && t("Auth.VerifyingYourEmail")}
          {isSuccess && t("Auth.EmailVerificationSuccess")}
          {isError && t("Auth.EmailVerificationError")}
        </p>
      </div>

      {isPending && (
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <Loader2 className="h-12 w-12 animate-spin text-white" />
          <p className="text-sm text-white/70">{t("Auth.RequestPending")}</p>
        </div>
      )}

      {isSuccess && (
        <div className="space-y-4">
          <Alert className="bg-green-500/20 border-green-500/50 text-white">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              {t("Auth.EmailVerificationSuccessAndRedirect")}
            </AlertDescription>
          </Alert>

          <Button
            onClick={() => router.push("/auth/login")}
            className="w-full bg-white text-gray-900 hover:bg-white/90"
            size="lg"
          >
            {t("Auth.GoBackToLogin")}
          </Button>
        </div>
      )}

      {isError && (
        <div className="space-y-4">
          <Alert
            variant="destructive"
            className="bg-red-500/20 border-red-500/50 text-white"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {(error as AxiosError)?.response?.status === 400
                ? t("Auth.ExpiredLink")
                : t("Auth.ErrorHappendEmailVerification")}
            </AlertDescription>
          </Alert>

          <Button
            onClick={() => router.push("/auth/login")}
            className="w-full bg-white text-gray-900 hover:bg-white/90"
            size="lg"
          >
            {t("Auth.GoBackToLogin")}
          </Button>
        </div>
      )}
    </div>
  );
}
