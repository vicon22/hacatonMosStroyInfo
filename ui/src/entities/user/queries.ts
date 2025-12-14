import { selfId } from './constants';
import {
    root,
    getById,
} from './services';

export const selfUserQueryKey = [
    root,
    selfId,
];

export const getSelfUserQuery = () => ({
    queryKey: selfUserQueryKey,
    queryFn: () => getById(selfId),
});