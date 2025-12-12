import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const admissionRoutes = ['/login', '/signup'];
const publicRoutes = [...admissionRoutes, '/api', '/_next', '/media']

export default async function proxy(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const isPublicRoute = publicRoutes.includes(path);
    const cookie = (await cookies()).get('fm_session')?.value;

    if (cookie && admissionRoutes.includes(path)) {
        return NextResponse.redirect(new URL('/', req.nextUrl));
    }

    // 4. Redirect to /login if the user is not authenticated
    if (!isPublicRoute && !cookie) {
        return NextResponse.redirect(new URL('/login', req.nextUrl));
    }

    // 5. Redirect to /dashboard if the user is authenticated
    if (
        isPublicRoute &&
        cookie &&
        !req.nextUrl.pathname.startsWith('/')
    ) {
        return NextResponse.redirect(new URL('/', req.nextUrl));
    }

    return NextResponse.next();
}

// Routes Proxy should not run on
export const config = {
    matcher: ['/((?!api|_next/*).*)'],
}