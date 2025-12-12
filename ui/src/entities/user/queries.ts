import { selfId } from './constants';
import {
  root,
  getById,
} from './services';

export const getSelfUserQuery = () => ({
  queryKey: [
    root,
    selfId,
  ],
  queryFn: () => getById(selfId),
});