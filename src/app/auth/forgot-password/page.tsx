"use client";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useForgotPassword } from "@/api/hooks";
import { AxiosError } from "axios";
import { useTranslation } from "react-i18next";

type ForgotPasswordFormData = {
  email: string;
};

export default function ForgotPasswordPage() {
  const router = useRouter();
  const emailInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>();

  const {
    mutate: forgotPassword,
    isPending,
    isError,
    isSuccess,
    error,
  } = useForgotPassword();

  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotPassword(data.email);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          {t("Auth.ForgotPasswordTitle")}
        </h1>
        <p className="text-sm text-white/80">
          {t("Auth.ForgotPasswordSubtitle")}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="min-h-20">
          {isError && (
            <Alert
              variant="destructive"
              className="bg-red-500/20 border-red-500/50 text-white"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {(error as AxiosError)?.response?.status === 404
                  ? t("Auth.EmailNotFound")
                  : t("Auth.ErrorOccurred")}
              </AlertDescription>
            </Alert>
          )}

          {isSuccess && (
            <Alert className="bg-green-500/20 border-green-500/50 text-white">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                {t("Auth.PasswordResetLinkSent")}
              </AlertDescription>
            </Alert>
          )}
        </div>

        {!isSuccess && (
          <>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                {t("Auth.Email")}
              </Label>
              <Input
                id="email"
                type="email"
                {...register("email", {
                  required: t("Auth.EmailRequired"),
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: t("Auth.InvalidEmailFormat"),
                  },
                })}
                className="border-white/30 bg-white/20 text-white placeholder:text-white/60 focus:border-white/50"
                placeholder={t("Auth.EmailPlaceholder")}
                disabled={isPending}
              />
              {errors.email && (
                <p className="text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-white text-gray-900 hover:bg-white/90 disabled:opacity-50"
              size="lg"
            >
              {isPending ? t("Auth.Sending") : t("Auth.SendLink")}
            </Button>
          </>
        )}

        <Button
          type="button"
          variant="link"
          onClick={() => router.push("/auth/login")}
          className="w-full"
          size="lg"
        >
          <ArrowLeft />
          {t("Auth.BackToLogin")}
        </Button>
      </form>
    </div>
  );
}
