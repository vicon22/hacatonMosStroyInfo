'use client'

import { useAllBlueprints } from "@/entities/blueprints/hooks";
import { Card, Text } from "@gravity-ui/uikit";
import { memo, useMemo } from "react"
import cn from 'classnames';
import { useTranslation } from "react-i18next";
import st from './dashboard.module.css';
import Link from "next/link";

export const Dashboard = memo(function Dashboard() {
    const { t } = useTranslation();
    const blueprints = useAllBlueprints();

    const formatter = useMemo(() => new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        notation: 'compact',
    }), []);

    return (
        <div>
            <div>
                <Text variant='header-2'>
                    {t('dashboard.start_project')}
                </Text>

                <ul className={st.tiles}>
                    {blueprints.data?.map(item => (
                        <li key={item.id}>
                            <Link href={`/blueprints/${item.id}`}>
                                <Card className={cn(st.tile, st.large)} view='filled'>
                                    <img className={st.image} loading='lazy' src={item.image_url} alt={item.title} />
                                    <Text variant='subheader-1'>{item.title}</Text>
                                    <div suppressHydrationWarning>
                                        <Text variant='subheader-1'>{formatter.format(item.price)}</Text>
                                    </div>

                                </Card>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
})