import { getQueryClient } from "@/configs/queryClient";
import { getBlueprintByIdQuery } from "@/entities/blueprints/queries";
import { pageInit } from "@/shared/utils/app/pageInit";
import { Summary } from "@/widgets/blueprints/Summary/Summary";
import { Layout } from "@/widgets/layout/Layout";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";

type BlueprintByIdPageProps = {
  params: Promise<{
    id?: string
  }>
}

export default async function BlueprintByIdPage(props: BlueprintByIdPageProps) {
    const id = (await props.params)?.id;

    if (!id ) {
        notFound()
    }

    const client = getQueryClient();
  
    await pageInit(() => client.prefetchQuery(getBlueprintByIdQuery(id)));

    return (
        <HydrationBoundary state={dehydrate(client)}>
            <Layout>
                <Summary id={id}/>
            </Layout>
        </HydrationBoundary>
    )
}