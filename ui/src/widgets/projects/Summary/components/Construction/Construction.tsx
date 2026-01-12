"use client";

import { useProjectById } from "@/entities/projects/hooks";
import { useTranslation } from "react-i18next";
import dynamic from "next/dynamic";
import {
  Breadcrumbs,
  Card,
  Col,
  Container,
  Row,
  Stepper,
} from "@gravity-ui/uikit";
import { Chat } from "@/widgets/chat/Chat";
import st from "./construction.module.css";
import Link from "next/link";
import {
  CircleCheckFill,
  CircleNumber2,
  CircleNumber3,
} from "@gravity-ui/icons";

const LazyPlayer = dynamic(() => import("@/widgets/player/Player"), {
  ssr: false,
});

type ConstructionProps = {
  id: string;
};

export function Construction({ id }: ConstructionProps) {
  const { t } = useTranslation();
  const project = useProjectById(id);

  return (
    <Container>
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
            <Stepper.Item view="success" icon={CircleNumber2}>
              {t("projects.stages.construction")}
            </Stepper.Item>
            <Stepper.Item icon={CircleNumber3}>
              {t("projects.stages.confirmation")}
            </Stepper.Item>
          </Stepper>
        </Col>
      </Row>

      <Row space="10">
        <Col size={[12, { l: 8 }]}>
          <Card className={st.video}>
            <LazyPlayer source={String(project.data?.stream_urls[0])} />
          </Card>
        </Col>

        <Col size={[12, { l: 4 }]}>
          <Chat roomId={id} />
        </Col>
      </Row>
    </Container>
  );
}
