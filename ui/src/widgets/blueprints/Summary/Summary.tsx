'use client'

import { useAllBlueprints, useBlueprintById } from "@/entities/blueprints/hooks";
import { useAllProjects } from "@/entities/projects/hooks";
import { Card, Table, Text } from "@gravity-ui/uikit";
import { memo } from "react"
import { useTranslation } from "react-i18next";
import st from './summary.module.css';

const formatter = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    notation: 'compact',
});

type SummaryProps = {
    id: string;
}

export const Summary = memo(function Summary({id}: SummaryProps) {
    const {t} = useTranslation();
    const blueprint = useBlueprintById(id);

    return (
        <div>
            <Text variant='header-2'>
                {blueprint.data?.title}
            </Text>

            <div>
                <img className={st.image} src={blueprint.data?.image_url}/>
            </div>


            <ul>
                <li>Этажность: {blueprint.data?.floors}</li>
                <li>Санузлы: {blueprint.data?.bathrooms}</li>
                <li>Спасльни: {blueprint.data?.bedrooms}</li>
                <li>Комнаты: {blueprint.data?.rooms}</li>
                <li>Площадь: {blueprint.data?.area}</li>
                <li>Материал: {blueprint.data?.material}</li>
            </ul>
        </div>
    )
})