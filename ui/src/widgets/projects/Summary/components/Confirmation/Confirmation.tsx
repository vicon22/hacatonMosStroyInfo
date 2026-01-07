"use client";

import { useProjectById } from "@/entities/projects/hooks";
import { memo, useState } from "react";
import { useTranslation } from "react-i18next";

import st from "./confirmation.module.css";
import {
  Breadcrumbs,
  Button,
  Card,
  Col,
  Container,
  Modal,
  PlaceholderContainer,
  Row,
  Stepper,
  Text,
} from "@gravity-ui/uikit";
import Link from "next/link";
import { CircleCheckFill, Rocket, CircleNumber3 } from "@gravity-ui/icons";
import { useBlueprintById } from "@/entities/blueprints/hooks";
import { Checklist } from "./components/Checklist/Checklist";

type ConfirmationProps = {
  id: string;
};

export const Confirmation = memo(function Confirmation({
  id,
}: ConfirmationProps) {
  const { t } = useTranslation();
  const project = useProjectById(id);
  const blueprint = useBlueprintById(project?.data?.blueprint_id);
  const [open, setOpen] = useState(false);

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

      <Row>
        <Col size={[12, { l: 12 }]}>
          <Stepper className={st.stepper} size="l">
            <Stepper.Item view="success" icon={CircleCheckFill}>
              {t("projects.stages.approval")}
            </Stepper.Item>
            <Stepper.Item view="success" icon={CircleCheckFill}>
              {t("projects.stages.construction")}
            </Stepper.Item>
            <Stepper.Item view="success" icon={CircleNumber3}>
              {t("projects.stages.confirmation")}
            </Stepper.Item>
          </Stepper>
        </Col>
      </Row>

      <PlaceholderContainer
        className={st.placeholder}
        direction="column"
        size="promo"
        align="center"
        image={<Rocket width={80} height={80} />}
        actions={
          <div className={st.actions}>
            <Button size="xl" view="action" onClick={() => setOpen(true)}>
              {t("projects.confirmation.actions.approve")}
            </Button>
          </div>
        }
        content={
          <div className={st.hint}>
            <Text variant="subheader-3">
              {t("projects.confirmation.placeholder.title")}
            </Text>
            <Text variant="body-1">
              {t("projects.confirmation.placeholder.text")}
            </Text>
            <Card className={st.preview}>
              <img className={st.image} src={blueprint.data?.image_url} />
            </Card>
          </div>
        }
      />

      <Modal open={open} onOpenChange={setOpen}>
        <Checklist
          projectId={id}
          onConfirm={() => {
            setOpen(false);
          }}
        />
      </Modal>
    </Container>
  );
});
