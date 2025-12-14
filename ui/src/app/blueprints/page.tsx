import { getQueryClient } from "@/configs/queryClient";
import { getAllBlueprintsQuery } from "@/entities/blueprints/queries";
import { pageInit } from "@/shared/utils/app/pageInit";
import { Layout } from "@/widgets/layout/Layout";
import { Table } from "@/widgets/blueprints/Table/Table";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function BlueprintsPage() {
    const client = getQueryClient();

    await pageInit(() => Promise.all([
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