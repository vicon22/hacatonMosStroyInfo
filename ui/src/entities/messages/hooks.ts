import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getAllMessagesQuery } from './queries';
import { Message } from './types';

export function useAllMessages(
    options?: UseQueryOptions<Message[]>
) {
    return useQuery<Message[]>({
        ...getAllMessagesQuery(),
        ...options
    });
}
