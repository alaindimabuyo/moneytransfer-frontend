"use client";

import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/AuthShell";
import { useGoogleLogin, useSignup } from "@/lib/auth";
import { ApiClientError } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();
  const signup = useSignup();
  const googleLogin = useGoogleLogin();

  const errorMessage =
    signup.error instanceof ApiClientError
      ? signup.error.message
      : googleLogin.error instanceof ApiClientError
        ? googleLogin.error.message
        : signup.error || googleLogin.error
          ? "Something went wrong"
          : undefined;

  return (
    <AuthShell
      mode="signup"
      isPending={signup.isPending}
      googlePending={googleLogin.isPending}
      errorMessage={errorMessage}
      onEmailSubmit={async (vars) => {
        await signup.mutateAsync(vars).then(() => router.push("/quote"));
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
