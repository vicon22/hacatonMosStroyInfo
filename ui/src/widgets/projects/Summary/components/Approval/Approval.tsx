'use client'

import { useProjectById } from "@/entities/projects/hooks";
import { memo } from "react"
import { useTranslation } from "react-i18next";

import st from './approval.module.css';
import { Breadcrumbs, Button, Col, Container, Row, TextInput } from "@gravity-ui/uikit";
import Link from "next/link";

type ApprovalProps = {
    id: string;
}

export const Approval = memo(function Approval({ id }: ApprovalProps) {
    const { t } = useTranslation();
    const project = useProjectById(id);

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
                        <Breadcrumbs.Item>
                            <Link href='/projects'>
                                {t('nav.projects')}
                            </Link>
                        </Breadcrumbs.Item>
                        <Breadcrumbs.Item disabled>
                            {project.data?.title}
                        </Breadcrumbs.Item>
                    </Breadcrumbs>
                </Col>
            </Row>

            <Row>
                <Col size={[12, { l: 7 }]}>
                    <Button
                        className={st.submit}
                        size='xl'
                        view='action'
                    >
                        {t('projects.form.actions.submit')}
                    </Button>
                </Col>
            </Row>
        </Container>
    )
})
