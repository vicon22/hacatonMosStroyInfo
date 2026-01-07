import { getQueryClient } from "@/configs/queryClient";
import { getProjectByIdQuery } from "@/entities/projects/queries";
import { pageInit } from "@/shared/utils/app/pageInit";
import { Summary } from "@/widgets/projects/Summary/Summary";
import { Create } from "@/widgets/projects/Create/Create";
import { Layout } from "@/widgets/layout/Layout";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { getBlueprintByIdQuery } from "@/entities/blueprints/queries";
import { getAllDocumentsQuery } from "@/entities/documents/queries";

type ProjectByIdPageProps = {
  params: Promise<{ id?: string }>;
};

export default async function ProjectByIdPage(props: ProjectByIdPageProps) {
  const id = (await props.params)?.id;

  if (!id) {
    notFound();
  }

  const client = getQueryClient();
  const isCreation = id === "new";

  await pageInit(async () => {
    if (!isCreation) {
      await client.prefetchQuery(getProjectByIdQuery(id));
      await client.prefetchQuery(getAllDocumentsQuery());

      const project = await client.fetchQuery(getProjectByIdQuery(id));

      await client.prefetchQuery(getBlueprintByIdQuery(project.blueprint_id));
    }

    return Promise.resolve();
  });

  return (
    <HydrationBoundary state={dehydrate(client)}>
      <Layout>{id === "new" ? <Create /> : <Summary id={id} />}</Layout>
    </HydrationBoundary>
  );
}
