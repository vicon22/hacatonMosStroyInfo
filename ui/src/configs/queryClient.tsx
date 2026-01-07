import { QueryClient, isServer } from "@tanstack/react-query";

let client: QueryClient;

export function getQueryClient() {
  if (isServer || !client) {
    client = new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnMount: false,
          staleTime: 1000,
        },
      },
    });
  }

  return client;
}
