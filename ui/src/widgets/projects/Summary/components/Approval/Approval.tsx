"use client";

import {
  useChangeProjectStatusMutation,
  useProjectById,
} from "@/entities/projects/hooks";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import st from "./approval.module.css";
import {
  Breadcrumbs,
  Button,
  Col,
  Container,
  Modal,
  PlaceholderContainer,
  Row,
  Stepper,
  Text,
} from "@gravity-ui/uikit";
import Link from "next/link";
import {
  Files,
  CircleNumber1,
  CircleNumber2,
  CircleNumber3,
  SealCheck,
} from "@gravity-ui/icons";

import { Uploader } from "./components/Uploader/Uploader";
import { useAllDocuments } from "@/entities/documents/hooks";
import { Listing } from "./components/Listing/Listing";
import { DocumentStatus } from "@/entities/documents/types";
import { ProjectStatus } from "@/entities/projects/types";

type ApprovalProps = {
  id: string;
};

export function Approval({ id }: ApprovalProps) {
  const { t } = useTranslation();
  const project = useProjectById(id);
  const [uploaderOpen, setUploaderOpen] = useState(false);
  const [proceedOpen, setProceedOpen] = useState(false);
  const proceed = useChangeProjectStatusMutation({
    onSuccess() {
      setProceedOpen(false);
    },
  });

  const docsQuery = useAllDocuments();
  const projectDocs = (docsQuery.data || []).filter(
    (item) => item.projectId === id,
  );
  const isEmpty = !projectDocs.length;
  const allApproved =
    !isEmpty &&
    projectDocs.every((item) => item.status === DocumentStatus.reviewed);

  useEffect(() => {
    if (allApproved && !proceedOpen) {
      setProceedOpen(true);
    }
  }, []);

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
            <Stepper.Item view="success" icon={CircleNumber1}>
              {t("projects.stages.approval")}
            </Stepper.Item>
            <Stepper.Item icon={CircleNumber2}>
              {t("projects.stages.construction")}
            </Stepper.Item>
            <Stepper.Item icon={CircleNumber3}>
              {t("projects.stages.confirmation")}
            </Stepper.Item>
          </Stepper>
        </Col>
      </Row>

      {!isEmpty && <Listing items={projectDocs} />}

      {isEmpty && (
        <PlaceholderContainer
          className={st.placeholder}
          direction="column"
          size="promo"
          align="center"
          image={<Files width={80} height={80} />}
          actions={
            <div className={st.actions}>
              <Button
                size="xl"
                view="action"
                onClick={() => setUploaderOpen(true)}
              >
                {t("projects.approval.actions.upload")}
              </Button>
            </div>
          }
          content={
            <div className={st.hint}>
              <Text variant="subheader-3">
                {t("projects.approval.placeholder.title")}
              </Text>
              <Text variant="body-1">
                {t("projects.approval.placeholder.text")}
              </Text>
            </div>
          }
        />
      )}
      <Modal open={uploaderOpen} onOpenChange={setUploaderOpen}>
        <Uploader
          projectId={id}
          onUpload={() => {
            setUploaderOpen(false);
          }}
        />
      </Modal>

      <Modal open={proceedOpen}>
        <PlaceholderContainer
          className={st.placeholder}
          direction="column"
          size="promo"
          align="center"
          image={<SealCheck width={80} height={80} />}
          actions={
            <div className={st.actions}>
              <Button
                size="xl"
                view="action"
                loading={proceed.isPending}
                onClick={() => {
                  proceed.mutate({
                    status: ProjectStatus.pending,
                    id,
                  });
                }}
              >
                {t("projects.approval.actions.construct")}
              </Button>
            </div>
          }
          content={
            <div className={st.hint}>
              <Text variant="subheader-3">
                {t("projects.approval.review.placeholder.title")}
              </Text>
              <Text variant="body-1">
                {t("projects.approval.review.placeholder.text")}
              </Text>
            </div>
          }
        />
      </Modal>
    </Container>
  );
}
