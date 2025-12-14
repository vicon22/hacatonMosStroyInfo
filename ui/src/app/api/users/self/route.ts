import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { UserData } from '@/entities/user/types';

export async function GET() {
    const session = (await cookies()).get('fm_session');

    if (!session) {
        return NextResponse.error();
    }

    const name = Buffer.from(session.value, 'base64').toString('utf-8');

    return NextResponse.json<UserData>(name === 'admin'
        ? {
            id: 167,
            first_name: 'Admin',
            last_name: 'Adminov'
        } 
        : {
            id: 874,
            first_name: 'User',
            last_name: 'Userov'
        }
    );
}
