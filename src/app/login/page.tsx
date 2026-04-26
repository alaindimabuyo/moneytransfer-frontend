"use client";

import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/AuthShell";
import { useGoogleLogin, useLogin } from "@/lib/auth";
import { ApiClientError } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const login = useLogin();
  const googleLogin = useGoogleLogin();

  const errorMessage =
    login.error instanceof ApiClientError
      ? login.error.message
      : googleLogin.error instanceof ApiClientError
        ? googleLogin.error.message
        : login.error || googleLogin.error
          ? "Something went wrong"
          : undefined;

  return (
    <AuthShell
      mode="login"
      isPending={login.isPending}
      googlePending={googleLogin.isPending}
      errorMessage={errorMessage}
      onEmailSubmit={async (vars) => {
        await login.mutateAsync(vars).then(() => router.push("/quote"));
      }}
      onGoogleCredential={(idToken) =>
        googleLogin
          .mutateAsync(idToken)
          .then(() => router.push("/quote"))
          .catch(() => {})
      }
    />
  );
}
