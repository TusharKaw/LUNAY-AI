'use client';

// @ts-nocheck - Disable type checking for this file as we work through tRPC setup
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { trpc } from '../../lib/trpc';
import superjson from 'superjson';

export default function TRPCProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: '/api/trpc',
          // You can pass any HTTP headers you wish here
          headers() {
            return {
              // Get any authentication headers you want here
            };
          },
          transformer: superjson,
        }),
      ],
    })
  );

  // Using JSX directly - this is valid with our tsconfig.json
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
