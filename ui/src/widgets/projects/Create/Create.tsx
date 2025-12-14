'use client'

import { memo, useState } from "react"
import { useTranslation } from "react-i18next";
import { Breadcrumbs, Card, Col, Container, Row, Text,  Stepper, Progress, TextInput, Checkbox, RadioGroup, Radio, Button, Divider } from "@gravity-ui/uikit";
import { useAllBlueprints, useBlueprintById } from "@/entities/blueprints/hooks";

import st from './create.module.css';
import Link from "next/link";
import { useCreateProjectMutation } from "@/entities/projects/hooks";
import { CreateProjectPayload } from "@/entities/projects/types";
import { useRouter } from "next/navigation";

type CreateProps = {
    blueprintId?: string;
}

export const Create = memo(function Create({ blueprintId }: CreateProps) {
    const { t } = useTranslation();
    const router = useRouter();
    const blueprints = useAllBlueprints();
    const mutation = useCreateProjectMutation({
        onSuccess(project) {
            router.push(`/projects/${project.id}`)
        }
    });
    const [formState, setFormState] = useState<CreateProjectPayload>({
        title: '',
        address: '',
        blueprintId: ''
    });

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
                            {t('projects.create')}
                        </Breadcrumbs.Item>
                    </Breadcrumbs>
                </Col>
            </Row>

            <Row>
                <Col size={[12, { l: 7 }]}>
                    <Text className={st.title} variant='display-2'>
                        {t('projects.create')}
                    </Text>

                    <div className={st.main}>

                        <TextInput
                            label={t('projects.form.fields.title')}
                            size='xl'
                            value={formState.title}
                            onChange={(e) => {
                                setFormState(state => ({
                                    ...state,
                                    title: e.target.value
                                }))
                            }}
                        />

                        <Divider/>

                        <TextInput
                            label={t('projects.form.fields.address')}
                            size='xl'
                            value={formState.address}
                            onChange={(e) => {
                                setFormState(state => ({
                                    ...state,
                                    address: e.target.value
                                }))
                            }}
                        />
                    </div>
                </Col>
            </Row>
            <Row>
                <Col size={[12, { l: 7 }]}>
                    <Text className={st.title} variant='display-1'>
                        {t('projects.form.sections.blueprint.label')}
                    </Text>

                    <ul className={st.blueprints}>
                        {blueprints.data?.map(item => {
                            const id = String(item.id);

                            return (
                                <li key={item.id}>
                                    <Radio
                                        size='xl'
                                        value={id}
                                        checked={formState.blueprintId === id}
                                        onChange={() => {
                                            setFormState(state => ({
                                                ...state,
                                                blueprintId: id
                                            }))
                                        }}
                                    >
                                        <img className={st.preview} src={item.image_url}/>
                                        <Text variant='body-2'>
                                            {item.title}
                                        </Text>
                                    </Radio>
                                </li>
                            )
                        })}
                    </ul>

                </Col>
            </Row>
            <Row>
                <Col size={[12, { l: 7 }]}>
                    <Button
                        className={st.submit}
                        size='xl'
                        view='action'
                        loading={mutation.isPending}
                        disabled={mutation.isPending || (!formState.address.length || !formState.blueprintId || !formState.title)}
                        onClick={() => mutation.mutate(formState)}
                    >
                        {t('projects.form.actions.submit')}
                    </Button>
                </Col>
            </Row>
        </Container>
    )
});
