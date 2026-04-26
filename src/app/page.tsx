"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/auth";
import { PageLoader } from "@/components/ui/Loaders";

export default function HomePage() {
  const { data: user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    router.replace(user ? "/quote" : "/login");
  }, [user, isLoading, router]);

  return <PageLoader />;
}
