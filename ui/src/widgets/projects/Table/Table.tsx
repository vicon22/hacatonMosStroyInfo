"use client";

import { useAllProjects } from "@/entities/projects/hooks";
import {
  Breadcrumbs,
  Col,
  Container,
  Label,
  LabelProps,
  Row,
  Text,
  Table as UITable,
} from "@gravity-ui/uikit";
import Link from "next/link";
import { memo } from "react";
import st from "./table.module.css";
import { useAllBlueprints } from "@/entities/blueprints/hooks";
import { useTranslation } from "react-i18next";
import { ProjectStatus } from "@/entities/projects/types";

const formatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  notation: "compact",
});

export const Table = memo(function Table() {
  const { t } = useTranslation();
  const items = useAllBlueprints();
  const projects = useAllProjects();

  const statusLabels: Record<ProjectStatus, string> = {
    [ProjectStatus.new]: t("projects.states.new"),
    [ProjectStatus.approval]: t("projects.states.approval"),
    [ProjectStatus.pending]: t("projects.states.pending"),
    [ProjectStatus.completed]: t("projects.states.completed"),
  };

  const labelThemes: Record<ProjectStatus, LabelProps["theme"]> = {
    [ProjectStatus.new]: "info",
    [ProjectStatus.approval]: "warning",
    [ProjectStatus.pending]: "success",
    [ProjectStatus.completed]: "unknown",
  };

  return (
    <Container>
      <Row>
        <Col size={[12, { l: 12 }]}>
          <Breadcrumbs>
            <Breadcrumbs.Item>
              <Link href="/">{t("nav.home")}</Link>
            </Breadcrumbs.Item>
            <Breadcrumbs.Item disabled>{t("nav.projects")}</Breadcrumbs.Item>
          </Breadcrumbs>
        </Col>
      </Row>

      <Row>
        <Col size={[12, { l: 12 }]}>
          <Text className={st.title} variant="display-2">
            {t("nav.projects")}
          </Text>
        </Col>
      </Row>

      <Row>
        <UITable
          columns={[
            {
              id: "image",
              name: "",
              width: 150,
              template(item) {
                const blueprint = items.data?.find(
                  (bp) => bp.id === item.blueprint_id,
                );

                return (
                  <img className={st.preview} src={blueprint?.image_url} />
                );
              },
            },
            {
              id: "title",
              name: t("tables.columns.labels.title"),
              width: 150,
              template(item) {
                return <Link href={`projects/${item.id}`}>{item.title}</Link>;
              },
            },
            {
              id: "project",
              name: t("tables.columns.labels.project"),
              width: 150,
              template(item) {
                const blueprint = items.data?.find(
                  (bp) => bp.id === item.blueprint_id,
                );

                return (
                  <Link href={`blueprints/${blueprint?.id}`}>
                    {blueprint?.title}
                  </Link>
                );
              },
            },
            {
              id: "status",
              width: 150,
              name: t("tables.columns.labels.status"),
              template(item) {
                return (
                  <Label theme={labelThemes[item.status]}>
                    {statusLabels[item.status]}
                  </Label>
                );
              },
            },
            {
              id: "price",
              name: t("tables.columns.labels.price"),
              template(item) {
                const blueprint = items.data?.find(
                  (bp) => bp.id === item.blueprint_id,
                );

                return (
                  <Text variant="subheader-1">
                    {formatter.format(blueprint?.price || 0)}
                  </Text>
                );
              },
            },
          ]}
          data={projects.data || []}
        />
      </Row>
    </Container>
  );
});
