import { Layout } from "@/widgets/layout/Layout";
import { DocumentsTable } from "@/widgets/documents/Table/Table";

export default async function DocsPage() {
    return (
        <Layout>
            <DocumentsTable />
        </Layout>
    )
}