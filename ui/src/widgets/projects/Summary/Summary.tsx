'use client'

import { useProjectById } from "@/entities/projects/hooks";
import { Text } from "@gravity-ui/uikit";
import { memo, useState } from "react"
import { useTranslation } from "react-i18next";
import st from './summary.module.css';
import dynamic from "next/dynamic";
import {TabProvider, TabList, Tab, TabPanel} from '@gravity-ui/uikit';
import { useBlueprintById } from "@/entities/blueprints/hooks";
import Image from "next/image";

type SummaryProps = {
    id: string;
}

 const LazyPlayer = dynamic(
      () => import("@/widgets/player/Player"),
      { ssr: false }
);

export const Summary = memo(function Summary({id}: SummaryProps) {
    const {t} = useTranslation();
    const project = useProjectById(id);
    const blueprint = useBlueprintById(String(project.data?.blueprint_id));
    const [activeTab, setActiveTab] = useState<string>('video')

    return (
        <div>
            <Text variant='header-2'>
                {project.data?.title}
            </Text>


            <img className={st.image} src={String(blueprint.data?.image_url)} alt={String(project.data?.title)}/>

            <TabProvider value={activeTab} onUpdate={setActiveTab}>
                <TabList>
                    <Tab value="video">Online translation</Tab>
                    <Tab value="documents" disabled>Documents</Tab>
                    <Tab value="chat" disabled>Chat</Tab>
                </TabList>
                <div>
                    <TabPanel value="video">
                        <div className={st.video}>
                            {activeTab === 'video' && <LazyPlayer />}
                        </div>
                    </TabPanel>
                    <TabPanel value="documents">docs</TabPanel>
                    <TabPanel value="chat">chat</TabPanel>
                </div>
            </TabProvider>
        </div>
    )
})