'use client'

import { useProjectById } from "@/entities/projects/hooks";

import { memo } from "react"
import { useTranslation } from "react-i18next";

import dynamic from "next/dynamic";
import { Breadcrumbs, Card, Col, Container, Row, Text,  Stepper, Progress } from "@gravity-ui/uikit";
import { useBlueprintById } from "@/entities/blueprints/hooks";

import { Chat } from "@/widgets/chat/Chat";
import st from './construction.module.css';
import Link from "next/link";
import { PersonWorker } from "@gravity-ui/icons";

const LazyPlayer = dynamic(
    () => import("@/widgets/player/Player"),
    { ssr: false }
);

type ConstructionProps = {
    id: string;
}

export const Construction = memo(function Construction({ id }: ConstructionProps) {
    const { t } = useTranslation();
    const project = useProjectById(id);
    const blueprint = useBlueprintById(String(project.data?.blueprint_id));

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
                <Col size={[12, { l: 12 }]}>
                    <Text className={st.title} variant='display-2'>
                        {blueprint.data?.title}
                    </Text>
                </Col>
            </Row>

            <Row>
                <Col size={[12, { l: 12 }]}>
                    <Card view='filled' className={st.stages} theme='info'>
                        <Stepper size='l'>
                            <Stepper.Item view='success'>
                                Подготовительные работы
                            </Stepper.Item>
                            <Stepper.Item view='success'>
                                Фундамент
                                <Progress value={100} size='xs' theme='success' />
                            </Stepper.Item>
                            <Stepper.Item view='error' icon={PersonWorker}>
                                Возведение стен
                                <Progress value={70} size='xs' theme='warning' />
                            </Stepper.Item>
                            <Stepper.Item>
                                Кровля
                                <Progress value={0} size='xs' theme='default' />
                            </Stepper.Item>
                        </Stepper>

                        <Progress value={70} size='m' theme='success' />
                    </Card>
                </Col>
            </Row>

            <Row space='10'>
                <Col size={[12, { l: 9 }]}>
                    <div className={st.videos}>
                        {project.data?.stream_urls.map(url => (
                            <Card className={st.video} key={url}>
                                <LazyPlayer source={url}/>
                            </Card>
                        ))}
                    </div>
                </Col>

                <Col size={[12, { l: 3 }]}>
                    <Chat roomId={id}/>
                </Col>
            </Row>
        </Container>
    )
})
