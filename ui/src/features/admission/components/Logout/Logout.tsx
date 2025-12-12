'use client'

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useLogoutMutation } from '@/features/auth/hooks';

export default function Logout() {
    const router = useRouter();

    const { mutate } = useLogoutMutation({
        onSuccess: () => {
            router.replace('/login');
        }
    });

    useEffect(mutate, [mutate]);

    return null;
}
