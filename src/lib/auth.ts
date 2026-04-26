"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, ApiClientError } from "./api";
import type { User } from "@/types/api";

export const USER_QUERY_KEY = ["currentUser"] as const;

export function useUser() {
  return useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: async () => {
      try {
        const data = await api<{ user: User }>("/auth/me");
        return data.user;
      } catch (err) {
        if (err instanceof ApiClientError && err.status === 401) {
          return null;
        }
        throw err;
      }
    },
    staleTime: 60_000,
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { email: string; password: string }) => {
      const data = await api<{ user: User }>("/auth/login", {
        method: "POST",
        body: JSON.stringify(vars),
      });
      return data.user;
    },
    onSuccess: (user) => {
      qc.setQueryData(USER_QUERY_KEY, user);
    },
  });
}

export function useGoogleLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (idToken: string) => {
      const data = await api<{ user: User }>("/auth/google", {
        method: "POST",
        body: JSON.stringify({ idToken }),
      });
      return data.user;
    },
    onSuccess: (user) => {
      qc.setQueryData(USER_QUERY_KEY, user);
    },
  });
}

export function useSignup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { email: string; password: string }) => {
      const data = await api<{ user: User }>("/auth/signup", {
        method: "POST",
        body: JSON.stringify(vars),
      });
      return data.user;
    },
    onSuccess: (user) => {
      qc.setQueryData(USER_QUERY_KEY, user);
    },
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await api<{ ok: true }>("/auth/logout", { method: "POST" });
    },
    onSuccess: () => {
      qc.setQueryData(USER_QUERY_KEY, null);
      qc.clear();
    },
  });
}
