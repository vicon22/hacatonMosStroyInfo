"use client";

import {
  Table,
  Text,
  Button,
  Icon,
  Label,
  LabelProps,
} from "@gravity-ui/uikit";
import { ArrowUpFromSquare } from "@gravity-ui/icons";
import { memo } from "react";
import { useReviewDocumentMutation } from "@/entities/documents/hooks";
import { Document, DocumentStatus } from "@/entities/documents/types";
import { useTranslation } from "react-i18next";

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

type ListingProps = {
  items: Document[];
};

export const Listing = memo(function Listing(props: ListingProps) {
  const { t } = useTranslation();
  const review = useReviewDocumentMutation();

  const STATUS_LABELS: Record<DocumentStatus, string> = {
    [DocumentStatus.new]: t("documents.states.new"),
    [DocumentStatus.onReview]: t("documents.states.on_review"),
    [DocumentStatus.reviewed]: t("documents.states.reviewed"),
  };

  const STATUS_THEMES: Record<DocumentStatus, LabelProps["theme"]> = {
    [DocumentStatus.new]: "normal",
    [DocumentStatus.onReview]: "warning",
    [DocumentStatus.reviewed]: "success",
  };

  return (
    <Table
      columns={[
        {
          id: "name",
          name: t("tables.columns.labels.title"),
          template: (item) => (
            <Text variant="body-1">{item.originalFileName}</Text>
          ),
        },
        {
          id: "status",
          name: t("tables.columns.labels.status"),
          template: (item) => {
            return (
              <Label theme={STATUS_THEMES[item.status]}>
                {STATUS_LABELS[item.status]}
              </Label>
            );
          },
        },
        {
          id: "size",
          name: t("tables.columns.labels.size"),
          template: (item) => (
            <Text variant="body-1" color="secondary">
              {formatFileSize(item.fileSize)}
            </Text>
          ),
        },
        {
          id: "actions",
          name: "",
          template: (item) => (
            <div style={{ display: "flex", gap: "8px" }}>
              {item.status === "NEW" && (
                <Button
                  view="outlined-action"
                  size="l"
                  onClick={() =>
                    review.mutate({
                      id: item.id,
                      status: DocumentStatus.onReview,
                    })
                  }
                >
                  <Icon data={ArrowUpFromSquare} size={16} />
                  {t("tables.actions.review")}
                </Button>
              )}
            </div>
          ),
        },
      ]}
      data={props.items}
    />
  );
});
