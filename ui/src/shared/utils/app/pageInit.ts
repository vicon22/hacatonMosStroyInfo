import { cookies, headers } from 'next/headers';
import { ApiClient } from '@/shared/api';

export async function pageInit(resolver?: () => Promise<unknown>) {
    ApiClient.instance.addHeaders({
        //Cookie: cookies().toString(),
        'x-request-id': String((await headers()).get('x-request-id'))
    });

    return await resolver?.();
}