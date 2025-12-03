"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useParams, useRouter } from "next/navigation";
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import { useCompleteRegistration } from "@/api/hooks";
import { AxiosError } from "axios";
import { useTranslation } from "react-i18next";

type CompleteRegistrationFormData = {
  temporaryPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function CompleteRegistrationPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const userId = params.userId as string;

  const [showTempPassword, setShowTempPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CompleteRegistrationFormData>();

  const {
    mutate: completeRegistration,
    isPending,
    isError,
    error,
  } = useCompleteRegistration();

  const newPassword = watch("newPassword");
  const confirmPassword = watch("confirmPassword");
  const passwordMismatch = confirmPassword && newPassword !== confirmPassword;

  const onSubmit = (data: CompleteRegistrationFormData) => {
    completeRegistration(
      {
        id: Number(userId),
        temporaryPassword: data.temporaryPassword,
        newPassword: data.newPassword,
      },
      {
        onSuccess: () => {
          router.push("/dashboard");
        },
      }
    );
  };

  if (!userId || isNaN(Number(userId))) {
    return (
      <div className="space-y-6">
        <Alert
          variant="destructive"
          className="bg-red-500/20 border-red-500/50 text-white"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{t("Auth.InvalidLink")}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          {t("Auth.Title")}
        </h1>
        <p className="text-sm text-white/80">{t("Auth.Subtitle")}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="min-h-[60px]">
          {isError && (
            <Alert
              variant="destructive"
              className="bg-red-500/20 border-red-500/50 text-white"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {(error as AxiosError)?.response?.status === 401
                  ? t("Auth.ErrorInvalidPassword")
                  : t("Auth.ErrorGeneral")}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="temporaryPassword" className="text-white">
            {t("Auth.TemporaryPassword")}
          </Label>
          <div className="relative">
            <Input
              id="temporaryPassword"
              type={showTempPassword ? "text" : "password"}
              {...register("temporaryPassword", {
                required: t("Auth.TemporaryPasswordRequired"),
              })}
              className="border-white/30 bg-white/20 pr-10 text-white placeholder:text-white/60 focus:border-white/50"
              placeholder={t("Auth.TemporaryPasswordPlaceholder")}
              autoFocus
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 text-white/70 hover:bg-transparent hover:text-white"
              onClick={() => setShowTempPassword(!showTempPassword)}
              aria-label={
                showTempPassword
                  ? t("Auth.HidePassword")
                  : t("Auth.ShowPassword")
              }
            >
              {showTempPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          {errors.temporaryPassword && (
            <p className="text-sm text-red-400">
              {errors.temporaryPassword.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="newPassword" className="text-white">
            {t("Auth.NewPassword")}
          </Label>
          <div className="relative">
            <Input
              id="newPassword"
              type={showNewPassword ? "text" : "password"}
              {...register("newPassword", {
                required: t("Auth.NewPasswordRequired"),
                minLength: {
                  value: 6,
                  message: t("Auth.NewPasswordMinLength"),
                },
              })}
              className="border-white/30 bg-white/20 pr-10 text-white placeholder:text-white/60 focus:border-white/50"
              placeholder={t("Auth.NewPasswordPlaceholder")}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 text-white/70 hover:bg-transparent hover:text-white"
              onClick={() => setShowNewPassword(!showNewPassword)}
              aria-label={
                showNewPassword
                  ? t("Auth.HidePassword")
                  : t("Auth.ShowPassword")
              }
            >
              {showNewPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          {errors.newPassword && (
            <p className="text-sm text-red-400">{errors.newPassword.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-white">
            {t("Auth.ConfirmPassword")}
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirmPassword", {
                required: t("Auth.ConfirmPasswordRequired"),
                validate: (value) =>
                  value === newPassword || t("Auth.PasswordMismatch"),
              })}
              className={`border-white/30 bg-white/20 pr-10 text-white placeholder:text-white/60 focus:border-white/50 ${
                passwordMismatch ? "border-red-500/50" : ""
              } ${
                confirmPassword && !passwordMismatch
                  ? "border-green-500/50"
                  : ""
              }`}
              placeholder={t("Auth.ConfirmPasswordPlaceholder")}
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
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
            {confirmPassword && !passwordMismatch && (
              <CheckCircle2 className="absolute right-10 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
            )}
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-400">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full bg-white text-gray-900 hover:bg-white/90 disabled:opacity-50"
          size="lg"
        >
          {isPending ? t("Auth.SubmitButtonLoading") : t("Auth.SubmitButton")}
        </Button>
      </form>
    </div>
  );
}
