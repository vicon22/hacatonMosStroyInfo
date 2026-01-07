import { cookies, headers } from "next/headers";
import { ApiClient } from "@/shared/api";
import { getQueryClient } from "@/configs/queryClient";
import { getSelfUserQuery } from "@/entities/user/queries";

export async function pageInit(resolver?: () => Promise<unknown>) {
  const cookieStore = await cookies();

  try {
    const client = getQueryClient();

    ApiClient.instance.addHeaders({
      Cookie: cookieStore.toString(),
      "x-request-id": String((await headers()).get("x-request-id")),
    });

    await client.prefetchQuery(getSelfUserQuery());

    return await resolver?.();
  } catch (e) {
    console.error("[pageInit] Error:", e);
    return;
  }
}
