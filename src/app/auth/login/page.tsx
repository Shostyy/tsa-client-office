"use client";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { useLogin } from "@/api/hooks";
import { AxiosError } from "axios";
import { useTranslation } from "react-i18next";

type LoginFormData = {
  username: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const { t, i18n } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<LoginFormData>();

  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending, isError, error } = useLogin();

  useEffect(() => {
    usernameInputRef.current?.focus();
  }, []);

  useEffect(() => {
    clearErrors();
  }, [i18n.language, clearErrors]);

  const onSubmit = (data: LoginFormData) => {
    login(data, {
      onSuccess: () => {
        const returnUrl = searchParams?.get("returnUrl");

        if (returnUrl && returnUrl !== "/") {
          router.push(returnUrl);
        } else {
          router.push("/dashboard");
        }
      },
    });
  };

  const is401Error = isError && (error as AxiosError)?.response?.status === 401;

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          {t("Auth.Authorization")}
        </h1>
        <p className="text-sm text-white/80">{t("Auth.EnterYourData")}</p>
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
                {is401Error
                  ? t("Auth.IncorrectUserNameOrPasswordTitle")
                  : t("Auth.GeneralError")}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="username" className="text-white">
            {t("Auth.Login")}
          </Label>
          <Input
            id="username"
            type="text"
            {...register("username", {
              required: t("Auth.UsernameIsRequired"),
            })}
            className="border-white/30 bg-white/20 text-white placeholder:text-white/60 focus:border-white/50"
          />
          {errors.username && (
            <p className="text-sm text-red-400">{errors.username.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-white">
            {t("Auth.Password")}
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: t("Auth.PasswordIsRequired"),
              })}
              className="border-white/30 bg-white/20 pr-10 text-white placeholder:text-white/60 focus:border-white/50"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 text-white/70 hover:bg-transparent hover:text-white"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Сховати пароль" : "Показати пароль"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-400">{errors.password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full bg-white text-gray-900 hover:bg-white/90 disabled:opacity-50"
          size="lg"
        >
          {isPending ? t("Auth.Entering") : t("Auth.Enter")}
        </Button>

        <div className="text-center">
          <Link
            href="/auth/forgot-password"
            className="text-sm text-white hover:underline"
          >
            {t("Auth.ForgotPassword")}
          </Link>
        </div>
      </form>
    </div>
  );
}
