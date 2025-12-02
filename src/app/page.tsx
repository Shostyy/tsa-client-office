"use client";
import { ThemeToggle } from "@/components/common";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

export default function Home() {
  const { theme } = useTheme();
  const router = useRouter();

  router.push("/login");

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main></main>
    </div>
  );
}
