"use client";

import { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import st from "./uploader.module.css";
import { Button, Card, Text } from "@gravity-ui/uikit";
import { FilePicker } from "@/ui/FilePicker/FilePicker";
import { useUploadProjectFileMutation } from "@/entities/projects/hooks";

type UploaderProps = {
  projectId: string;
  onUpload: VoidFunction;
};

export const Uploader = memo(function Uploader(props: UploaderProps) {
  const { t } = useTranslation();

  const upload = useUploadProjectFileMutation();

  const [passportFile, setPassportFile] = useState<File | null>(null);
  const [propertyFile, setPropertyFile] = useState<File | null>(null);
  const [schemaFile, setSchemaFile] = useState<File | null>(null);
  const [contractFile, setContractFile] = useState<File | null>(null);

  const filesList = [passportFile, propertyFile, schemaFile, contractFile];

  return (
    <div className={st.layout}>
      <Text variant="display-1" className={st.title}>
        {t("projects.approval.uploader.title")}
      </Text>

      <div className={st.form}>
        <Card className={st.unit}>
          <Text variant="subheader-3">
            {t("projects.approval.uploader.files.passport.title")}
          </Text>
          <Text variant="body-1" className={st.desc}>
            {t("projects.approval.uploader.files.passport.desc")}
          </Text>
          <FilePicker value={passportFile} onChange={setPassportFile} />
        </Card>
        <Card className={st.unit}>
          <Text variant="subheader-3">
            {t("projects.approval.uploader.files.contract.title")}
          </Text>
          <Text variant="body-1" className={st.desc}>
            {t("projects.approval.uploader.files.contract.desc")}
          </Text>
          <FilePicker value={propertyFile} onChange={setPropertyFile} />
        </Card>
        <Card className={st.unit}>
          <Text variant="subheader-3">
            {t("projects.approval.uploader.files.property.title")}
          </Text>
          <Text variant="body-1" className={st.desc}>
            {t("projects.approval.uploader.files.property.desc")}
          </Text>
          <FilePicker value={schemaFile} onChange={setSchemaFile} />
        </Card>
        <Card className={st.unit}>
          <Text variant="subheader-3">
            {t("projects.approval.uploader.files.schema.title")}
          </Text>
          <Text variant="body-1" className={st.desc}>
            {t("projects.approval.uploader.files.schema.desc")}
          </Text>
          <FilePicker value={contractFile} onChange={setContractFile} />
        </Card>
      </div>

      <div className={st.footer}>
        <Button
          loading={upload.isPending}
          view="action"
          size="xl"
          disabled={!filesList.every(Boolean)}
          onClick={() => {
            upload.mutate(
              {
                id: props.projectId,
                files: filesList.filter((file) => file !== null),
              },
              {
                onSuccess: props.onUpload,
              },
            );
          }}
        >
          {t("projects.approval.uploader.actions.submit")}
        </Button>
      </div>
    </div>
  );
});
