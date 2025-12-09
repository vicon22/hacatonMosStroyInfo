import { getQueryClient } from "@/configs/queryClient";
import { getAllBlueprintsQuery } from "@/entities/blueprints/queries";
import { getAllProjectsQuery } from "@/entities/projects/queries";
import { pageInit } from "@/shared/utils/app/pageInit";
import { Dashboard } from "@/widgets/dashboard/Dashboard";
import { Layout } from "@/widgets/layout/Layout";
import { Table } from "@/widgets/projects/Table/Table";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function Home() {
    const client = getQueryClient();

    await pageInit(() => Promise.all([
        client.prefetchQuery(getAllProjectsQuery()),
        client.prefetchQuery(getAllBlueprintsQuery()),
    ]));

    return (
        <HydrationBoundary state={dehydrate(client)}>
            <Layout>
                <Table/>
            </Layout>
        </HydrationBoundary>
    )
}