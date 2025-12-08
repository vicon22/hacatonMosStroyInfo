import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import {
    getAllBlueprintsQuery,
    getBlueprintByIdQuery
} from './queries';
import { Blueprint, BlueprintID } from './types';

export function useAllBlueprints(
    options?: UseQueryOptions<Blueprint[]>
) {

    return useQuery<Blueprint[]>({
        ...getAllBlueprintsQuery(),
        ...options
    });
}

export function useBlueprintById(
    id: BlueprintID,
    options?: Partial<UseQueryOptions<Blueprint>>
) {
    return useQuery<Blueprint>({
        ...getBlueprintByIdQuery(id),
        ...options
    });
}