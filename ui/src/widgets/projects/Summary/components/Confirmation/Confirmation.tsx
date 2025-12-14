'use client'

import { useProjectById } from "@/entities/projects/hooks";
import { memo } from "react"
import { useTranslation } from "react-i18next";

import st from './confirmation.module.css';

type ConfirmationProps = {
    id: string;
}

export const Confirmation = memo(function Approval({ id }: ConfirmationProps) {
    const { t } = useTranslation();
    const project = useProjectById(id);

    return <b>Confirmation</b>
})
