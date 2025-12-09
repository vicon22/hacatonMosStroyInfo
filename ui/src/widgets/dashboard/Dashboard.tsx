'use client'

import { useAllBlueprints } from "@/entities/blueprints/hooks";
import { useAllProjects } from "@/entities/projects/hooks";
import { Card, Text } from "@gravity-ui/uikit";
import { memo } from "react"
import { useTranslation } from "react-i18next";
import st from './dashboard.module.css';
import Link from "next/link";

const formatter = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    notation: 'compact',
});

export const Dashboard = memo(function Dashboard() {
    const { t } = useTranslation();
    const projects = useAllProjects();
    const blueprints = useAllBlueprints();

    return (
        <div>
            <div>
                <Text variant='header-2'>
                    {t('blueprints.header')}
                </Text>

                <ul className={st.tiles}>
                    {blueprints.data?.map(item => (
                        <li key={item.id}>
                            <Link href={`/blueprints/${item.id}`}>
                                <Card className={st.tile} view='filled'>
                                    <img className={st.image} loading='lazy' src={item.image_url} alt={item.title} />
                                    <Text variant='subheader-1'>{item.title}</Text>
                                    <div>
                                        <Text variant='subheader-1'>{formatter.format(item.price)}</Text>
                                    </div>

                                </Card>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            <Text variant='header-2'>
                {t('projects.active.header')}
            </Text>

            <ul className={st.tiles}>
                {projects.data?.map(item => {
                    const blueprint = blueprints.data?.find(b => b.id === item.blueprint_id);

                    return (
                        <li key={item.id}>
                            <Link href={`/projects/${item.id}`}>
                                <Card className={st.tile} view='filled'>
                                    <img className={st.image} loading='lazy' src={blueprint?.image_url} alt={item.title} />
                                    <Text variant='subheader-1'>{item.title}</Text>
                                </Card>
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
})