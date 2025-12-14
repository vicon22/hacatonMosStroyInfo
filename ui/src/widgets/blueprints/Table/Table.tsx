'use client'

import { useAllProjects } from "@/entities/projects/hooks";
import { Breadcrumbs, Col, Container, Row, Text, Table as UITable } from "@gravity-ui/uikit";
import Link from "next/link";
import { memo } from "react";
import st from './table.module.css'
import { useAllBlueprints } from "@/entities/blueprints/hooks";
import { useTranslation } from "react-i18next";


const formatter = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    notation: 'compact',
});


export const Table = memo(function Table() {
    const {t} = useTranslation();
    const items = useAllBlueprints();

    return (
        <Container>
            <Row>
                <Col size={[12, { l: 12 }]}>
                    <Breadcrumbs>
                        <Breadcrumbs.Item>
                            <Link href='/'>
                                {t('nav.home')}
                            </Link>
                        </Breadcrumbs.Item>
                        <Breadcrumbs.Item disabled>
                            {t('nav.blueprints')}
                        </Breadcrumbs.Item>
                    </Breadcrumbs>
                </Col>
            </Row>

            <Row>
                <Col size={[12, { l: 12 }]}>
                    <Text className={st.title} variant='display-2'>
                        Варианты проектов
                    </Text>
                </Col>
            </Row>

            <Row>
                <UITable
                    columns={[
                        {
                            id: 'image',
                            name: '',
                            width: 150,
                            template(item) {
                                return <img className={st.preview} src={item.image_url}/>
                            },
                        },
                        { 
                            id: 'title',
                            name: t('tables.columns.labels.title'),
                            width: 150,
                            template(item) {
                                return (
                                    <Link href={`blueprints/${item.id}`}>
                                        {item.title}
                                    </Link>
                                );
                            },
                        },
                        { id: 'area', name: t('tables.columns.labels.area') },
                        { id: 'floors', name: t('tables.columns.labels.floors') },
                        { id: 'material', width: 100, name: t('tables.columns.labels.material') },
                        { id: 'bedrooms', name: t('tables.columns.labels.bedrooms') },
                        { id: 'bathrooms', name: t('tables.columns.labels.bathrooms') },
                        {
                            id: 'price',
                            name: t('tables.columns.labels.price'),
                            template(item) {
                                return (
                                    <Text variant='subheader-1'>
                                        {formatter.format(item.price)}
                                    </Text>
                                );
                            },
                        }
                    ]}
                    data={items.data || []}
                />
            </Row>
        </Container>
    )
})