import { getQueryClient } from "@/configs/queryClient";
import { getProjectByIdQuery } from "@/entities/projects/queries";
import { pageInit } from "@/shared/utils/app/pageInit";
import { Summary } from "@/widgets/projects/Summary/Summary";
import { Layout } from "@/widgets/layout/Layout";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { getBlueprintByIdQuery } from "@/entities/blueprints/queries";

type ProjectByIdPageProps = {
  params: Promise<{id?: string}>
}

export default async function ProjectByIdPage(props: ProjectByIdPageProps) {
    const id = (await props.params)?.id;

    if (!id ) {
        notFound();
    }

    const client = getQueryClient();
    await client.prefetchQuery(getProjectByIdQuery(id));

    const project = await client.fetchQuery(getProjectByIdQuery(id));
  
    await pageInit(() => client.prefetchQuery(getBlueprintByIdQuery(project.blueprint_id)));

    return (
        <HydrationBoundary state={dehydrate(client)}>
            <Layout>
                <Summary id={id}/>
            </Layout>
        </HydrationBoundary>
    )
}