"use client";

import { PropsWithChildren, useEffect, useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";
import { useAuthStore } from "@/store/auth-store";

function AuthHydrationHandler({ children }: PropsWithChildren) {
  const setHasHydrated = useAuthStore((state) => state.setHasHydrated);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  useEffect(() => {
    // Marcar como hidratado após o primeiro render no cliente
    // Isso garante que o Zustand já restaurou os dados do localStorage
    if (!hasHydrated) {
      // Pequeno delay para garantir que o Zustand persist terminou a hidratação
      const timer = setTimeout(() => {
        setHasHydrated(true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [hasHydrated, setHasHydrated]);

  return <>{children}</>;
}

export function Providers({ children }: PropsWithChildren) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 0,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthHydrationHandler>
        {children}
      </AuthHydrationHandler>
      <ReactQueryDevtools initialIsOpen={false} />
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}

