import { QueryClient } from '@tanstack/react-query';

let client: QueryClient;

export function getQueryClient() {

    if (!client) {
        client = new QueryClient({
            defaultOptions: {
                queries: {
                    refetchOnMount: false,
                    staleTime: 1000,
                },
            },
        })
    }

    return client;
}