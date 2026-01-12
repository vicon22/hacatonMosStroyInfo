import { FileArrowUp, CircleXmarkFill } from "@gravity-ui/icons";

import { Button, FilePreview, Icon } from "@gravity-ui/uikit";
import { useCallback, useRef, ChangeEvent } from "react";
import st from "./filePicker.module.css";
import { useTranslation } from "react-i18next";

type FilePickerProps = {
  value?: File | null;
  onChange: (file: File | null) => void;
};

export function FilePicker({ value, onChange }: FilePickerProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileSelect = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        onChange(e.target.files[0]);
      }
    },
    [onChange],
  );

  const handleReset = useCallback(() => {
    onChange(null);
  }, [onChange]);

  if (value) {
    return (
      <FilePreview
        selected
        file={value}
        actions={[
          {
            id: "delete",
            title: t("ui.filepicker.actions.delete"),
            icon: <CircleXmarkFill />,
            onClick: handleReset,
          },
        ]}
      />
    );
  }

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        className={st.input}
      />

      <Button
        view="raised"
        selected
        size="xl"
        onClick={() => fileInputRef.current?.click()}
      >
        <Icon data={FileArrowUp} size={20} />
        {t("ui.filepicker.actions.upload")}
      </Button>
    </div>
  );
}
