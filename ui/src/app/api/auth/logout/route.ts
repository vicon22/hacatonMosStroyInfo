import { cookies } from "next/headers";

export async function POST() {
    (await cookies()).delete('fm_session')

    return null;
}