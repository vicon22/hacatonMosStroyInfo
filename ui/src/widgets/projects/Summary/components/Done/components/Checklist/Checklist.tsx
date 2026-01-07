"use client";

import { memo, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import st from "./checklist.module.css";
import { Button, Text, Checkbox } from "@gravity-ui/uikit";
import {
  useChangeProjectStatusMutation,
  useUploadProjectFileMutation,
} from "@/entities/projects/hooks";
import { ProjectStatus } from "@/entities/projects/types";

type ChecklistProps = {
  projectId: string;
  onConfirm: VoidFunction;
};

enum FormSigns {
  inspected = "inspected",
  confirmed = "confirmed",
  signed = "signed",
}

type FormState = {
  [FormSigns.inspected]: boolean;
  [FormSigns.confirmed]: boolean;
  [FormSigns.signed]: boolean;
};

export const Checklist = memo(function Checklist(props: ChecklistProps) {
  const { t } = useTranslation();
  const complete = useChangeProjectStatusMutation();
  const [formState, setFormState] = useState<FormState>({
    [FormSigns.inspected]: false,
    [FormSigns.confirmed]: false,
    [FormSigns.signed]: false,
  });

  return (
    <div className={st.layout}>
      <Text variant="display-1" className={st.title}>
        {t("projects.confirmation.checklist.title")}
      </Text>

      <div className={st.form}>
        <Checkbox
          size="xl"
          checked={formState.inspected}
          onChange={(e) => {
            setFormState((state) => ({
              ...state,
              [FormSigns.inspected]: e.target.checked,
            }));
          }}
        >
          {t("projects.confirmation.checklist.signs.inspected")}
        </Checkbox>

        <Checkbox
          size="xl"
          checked={formState.confirmed}
          onChange={(e) => {
            setFormState((state) => ({
              ...state,
              [FormSigns.confirmed]: e.target.checked,
            }));
          }}
        >
          {t("projects.confirmation.checklist.signs.confirmed")}
        </Checkbox>

        <Checkbox
          size="xl"
          checked={formState.signed}
          onChange={(e) => {
            setFormState((state) => ({
              ...state,
              [FormSigns.signed]: e.target.checked,
            }));
          }}
        >
          {t("projects.confirmation.checklist.signs.signed")}
        </Checkbox>
      </div>

      <div className={st.footer}>
        <Button
          loading={complete.isPending}
          view="action"
          size="xl"
          disabled={!Object.values(formState).every(Boolean)}
          onClick={() => {
            complete.mutate({
              status: ProjectStatus.completed,
              id: props.projectId,
            });
          }}
        >
          {t("projects.confirmation.checklist.actions.submit")}
        </Button>
      </div>
    </div>
  );
});
