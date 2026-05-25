"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { getUserProfile } from "@/lib/user-profile";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    void getUserProfile().then((profile) => {
      router.replace(profile.onboarded ? "/dashboard" : "/onboarding");
    });
  }, [router]);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
    </div>
  );
}
