"use client";

import { useProjectById } from "@/entities/projects/hooks";
import { memo } from "react";
import { useTranslation } from "react-i18next";

import st from "./done.module.css";
import {
  Breadcrumbs,
  Card,
  Col,
  Container,
  PlaceholderContainer,
  Row,
  Text,
} from "@gravity-ui/uikit";
import Link from "next/link";
import { SquareCheck } from "@gravity-ui/icons";
import { useBlueprintById } from "@/entities/blueprints/hooks";

type DoneProps = {
  id: string;
};

export const Done = memo(function Done({ id }: DoneProps) {
  const { t } = useTranslation();
  const project = useProjectById(id);
  const blueprint = useBlueprintById(project?.data?.blueprint_id);

  return (
    <Container className={st.layout}>
      <Row>
        <Col size={[12, { l: 12 }]}>
          <Breadcrumbs>
            <Breadcrumbs.Item>
              <Link href="/">{t("nav.home")}</Link>
            </Breadcrumbs.Item>
            <Breadcrumbs.Item>
              <Link href="/projects">{t("nav.projects")}</Link>
            </Breadcrumbs.Item>
            <Breadcrumbs.Item disabled>{project.data?.title}</Breadcrumbs.Item>
          </Breadcrumbs>
        </Col>
      </Row>

      <PlaceholderContainer
        className={st.placeholder}
        direction="column"
        size="promo"
        align="center"
        image={<SquareCheck width={80} height={80} />}
        content={
          <div className={st.hint}>
            <Text variant="subheader-3">
              {t("projects.done.placeholder.title")}
            </Text>
            <Text variant="body-1">{t("projects.done.placeholder.text")}</Text>
            <Card className={st.preview}>
              <img className={st.image} src={blueprint.data?.image_url} />
            </Card>
          </div>
        }
      />
    </Container>
  );
});
