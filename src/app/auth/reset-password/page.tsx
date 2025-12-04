"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  CheckCircle2,
} from "lucide-react";
import { useResetPassword } from "@/api/hooks";
import { AxiosError } from "axios";
import { useTranslation } from "react-i18next";
import { resetPasswordValidationSchema } from "@/validation-schemas";

type ResetPasswordFormData = {
  password: string;
  passwordConfirmation: string;
};

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { t } = useTranslation();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setFocus,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(resetPasswordValidationSchema),
    mode: "onChange",
  });

  const {
    mutate: resetPassword,
    isPending,
    isError,
    isSuccess,
    error,
  } = useResetPassword();

  const password = watch("password");
  const passwordConfirmation = watch("passwordConfirmation");
  const passwordMatch =
    passwordConfirmation && password === passwordConfirmation;

  useEffect(() => {
    setFocus("password");
  }, [setFocus]);

  useEffect(() => {
    if (!token) {
      router.push("/auth/login");
    }
  }, [token, router]);

  const onSubmit = (data: ResetPasswordFormData) => {
    if (!token) return;

    resetPassword(
      { token, password: data.password },
      {
        onSuccess: () => {
          setTimeout(() => {
            router.push("/auth/login");
          }, 2000);
        },
      }
    );
  };

  const errorMessage = isError
    ? (error as AxiosError)?.response?.status === 400
      ? t("Auth.ExpiredTokenMessage")
      : t("Auth.ErrorOccurred")
    : null;

  if (!token) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          {t("Auth.ResetPassword")}
        </h1>
        <p className="text-sm text-white/80">{t("Auth.EnterNewPassword")}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="min-h-[60px]">
          {isSuccess && (
            <Alert className="bg-green-500/20 border-green-500/50 text-white">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                {t("Auth.PasswordSuccessfullyChanged")}
              </AlertDescription>
            </Alert>
          )}
          {errorMessage && !isSuccess && (
            <Alert
              variant="destructive"
              className="bg-red-500/20 border-red-500/50 text-white"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-white">
            {t("Auth.NewPassword")}
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              className="border-white/30 bg-white/20 pr-10 text-white placeholder:text-white/60 focus:border-white/50"
              disabled={isSuccess}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 text-white/70 hover:bg-transparent hover:text-white"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={
                showPassword ? t("Auth.HidePassword") : t("Auth.ShowPassword")
              }
              disabled={isSuccess}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="min-h-5">
            {errors.password && (
              <p className="text-sm text-red-400">
                {t(errors.password.message as string)}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="passwordConfirmation" className="text-white">
            {t("Auth.ConfirmPassword")}
          </Label>
          <div className="relative">
            <Input
              id="passwordConfirmation"
              type={showConfirmPassword ? "text" : "password"}
              {...register("passwordConfirmation")}
              className={`border-white/30 bg-white/20 pr-10 text-white placeholder:text-white/60 focus:border-white/50 ${
                errors.passwordConfirmation ? "border-red-500/50" : ""
              } ${
                passwordMatch && !errors.passwordConfirmation
                  ? "border-green-500/50"
                  : ""
              }`}
              disabled={isSuccess}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 text-white/70 hover:bg-transparent hover:text-white"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={
                showConfirmPassword
                  ? t("Auth.HidePassword")
                  : t("Auth.ShowPassword")
              }
              disabled={isSuccess}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
            {passwordMatch && !errors.passwordConfirmation && (
              <CheckCircle2 className="absolute right-10 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
            )}
          </div>
          <div className="min-h-5">
            {errors.passwordConfirmation && (
              <p className="text-sm text-red-400">
                {t(errors.passwordConfirmation.message as string)}
              </p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          disabled={isPending || isSuccess}
          className="w-full bg-white text-gray-900 hover:bg-white/90 disabled:opacity-50"
          size="lg"
        >
          {isPending
            ? t("Auth.Saving")
            : isSuccess
            ? t("Auth.Success")
            : t("Auth.ResetPasswordButton")}
        </Button>
      </form>
    </div>
  );
}
