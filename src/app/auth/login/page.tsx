"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const emailInputRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white">Вхід</h1>
        <p className="text-sm text-white/80">
          Введіть свої дані для входу в систему
        </p>
      </div>

      {/* Form */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white">
            Email
          </Label>
          <Input
            ref={emailInputRef}
            id="email"
            type="email"
            placeholder="name@example.com"
            required
            className="border-white/30 bg-white/20 text-white placeholder:text-white/60 focus:border-white/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-white">
            Пароль
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              required
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
        </div>

        <Button
          type="submit"
          className="w-full bg-white text-gray-900 hover:bg-white/90"
          size="lg"
        >
          Увійти
        </Button>

        <div className="text-center">
          <Link
            href="/login/forgot-password"
            className="text-sm text-white hover:underline"
          >
            Забули пароль?
          </Link>
        </div>
      </div>
    </div>
  );
}
