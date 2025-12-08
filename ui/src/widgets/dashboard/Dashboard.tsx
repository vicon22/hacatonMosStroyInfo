'use client'

import { useAllBlueprints } from "@/entities/blueprints/hooks";
import { useAllProjects } from "@/entities/projects/hooks";
import { Card, Table, Text } from "@gravity-ui/uikit";
import { memo } from "react"
import { useTranslation } from "react-i18next";
import st from './dashboard.module.css';

const formatter = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    notation: 'compact',
});

export const Dashboard = memo(function Dashboard() {
    const {t} = useTranslation();
    const projects = useAllProjects();
    const blueprints = useAllBlueprints();

    return (
        <div>
            <div>
                <Text variant='header-2'>
                    {t('blueprints.header')}
                </Text>

                <ul className={st.blueprints}>
                    {blueprints.data?.map(item => (
                        <li key={item.id}>
                            <Card className={st.blueprint} view='filled'>
                                <img className={st.image}  loading='lazy' src={item.image_url} alt={item.title} />
                                <Text variant='subheader-1'>{item.title}</Text>
                                <div>
                                    <Text variant='subheader-1'>{formatter.format(item.price)}</Text>
                                </div>
                                
                            </Card>
                        </li>
                    ))}
                </ul>
            </div>

            <Text variant='header-2'>
                {t('projects.active.header')}
            </Text>

            <Table
                columns={[
                    {id: 'title'},
                    {id: 'status'},
                    {id: 'blueprint_id'}
                ]}
                data={projects.data || []}
            />
        </div>
    )
})