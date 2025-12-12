import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
    const data = await request.json();

    console.log({data});

    const isValid = data.username === 'admin' && data.password === '123';

    if (isValid) {
        (await cookies()).set('fm_session', String(Math.floor(Math.random() * 100_000)))
    }

    return NextResponse.json<{ ok: boolean }>({
        ok: isValid
    });
}