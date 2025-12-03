"use client";
import { useCurrentUser } from "@/api/hooks";
import { redirect } from "next/navigation";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  const lang = searchParams.get("lang");

  const {
    data: userData,
    isPending: userDataPending,
    isError: userDataError,
  } = useCurrentUser();

  if (token && lang) {
    redirect(`/auth/verify-email?token=${token}&lang=${lang}`);
  }

  if (userDataPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <main className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900 dark:border-gray-700 dark:border-t-gray-100"></div>
        </main>
      </div>
    );
  }

  if (userData && !userDataError) {
    redirect("/dashboard");
  }

  redirect("/auth/login");
}
