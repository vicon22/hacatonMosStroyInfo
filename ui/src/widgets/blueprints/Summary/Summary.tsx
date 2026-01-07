"use client";

import { useBlueprintById } from "@/entities/blueprints/hooks";
import {
  Breadcrumbs,
  Button,
  Card,
  Col,
  Container,
  Divider,
  Row,
  Text,
  TextInput,
} from "@gravity-ui/uikit";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import st from "./summary.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Material } from "@/entities/blueprints/types";

const formatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  notation: "compact",
});

type SummaryProps = {
  id: string;
};

export const Summary = memo(function Summary({ id }: SummaryProps) {
  const { t } = useTranslation();
  const blueprint = useBlueprintById(id);
  const router = useRouter();

  const materialLabels: Record<Material, string> = {
    [Material.aeratedConcrete]: t("blueprints.materials.aeratedConcrete"),
    [Material.bricks]: t("blueprints.materials.bricks"),
    [Material.reinforcedConcrete]: t("blueprints.materials.reinforcedConcrete"),
    [Material.timber]: t("blueprints.materials.timber"),
  };

  if (!blueprint.data) {
    return null;
  }

  return (
    <Container>
      <Row>
        <Col size={[12, { l: 12 }]}>
          <Breadcrumbs>
            <Breadcrumbs.Item>
              <Link href="/">{t("nav.home")}</Link>
            </Breadcrumbs.Item>
            <Breadcrumbs.Item>
              <Link href="/blueprints">{t("nav.blueprints")}</Link>
            </Breadcrumbs.Item>
            <Breadcrumbs.Item disabled>{blueprint.data.title}</Breadcrumbs.Item>
          </Breadcrumbs>
        </Col>
      </Row>

      <Row>
        <Col size={[12, { l: 12 }]}>
          <Text className={st.title} variant="display-2">
            {blueprint.data.title}
          </Text>
        </Col>
      </Row>

      <Row space="10">
        <Col size={[12, { l: 9 }]}>
          <Card className={st.card}>
            <img className={st.image} src={blueprint.data?.image_url} />
          </Card>

          <Card view="filled" className={st.details}>
            <Text variant="header-2">{t("blueprints.labels.details")}</Text>

            <div className={st.properties}>
              <div className={st.property}>
                <Text variant="body-1">
                  {t("tables.columns.labels.floors")}
                </Text>
                <Text variant="subheader-1">{blueprint.data?.floors}</Text>
              </div>

              <div className={st.property}>
                <Text variant="body-1">{t("tables.columns.labels.area")}</Text>
                <Text variant="subheader-1">{blueprint.data.area}</Text>
              </div>

              <div className={st.property}>
                <Text variant="body-1">
                  {t("tables.columns.labels.material")}
                </Text>
                <Text variant="subheader-1">
                  {materialLabels[blueprint.data.material]}
                </Text>
              </div>

              <div className={st.property}>
                <Text variant="body-1">{t("tables.columns.labels.rooms")}</Text>
                <Text variant="subheader-1">{blueprint.data.rooms}</Text>
              </div>

              <div className={st.property}>
                <Text variant="body-1">
                  {t("tables.columns.labels.bathrooms")}
                </Text>
                <Text variant="subheader-1">{blueprint.data.bathrooms}</Text>
              </div>

              <div className={st.property}>
                <Text variant="body-1">
                  {t("tables.columns.labels.bedrooms")}
                </Text>
                <Text variant="subheader-1">{blueprint.data.bedrooms}</Text>
              </div>
            </div>

            <Text variant="body-1">{blueprint.data.description}</Text>
          </Card>
        </Col>

        <Col size={[12, { l: 3 }]}>
          <Card view="filled" className={st.info} theme="info">
            <Text variant="header-2">{t("blueprints.labels.about")}</Text>
            <div className={st.features}>
              <div className={st.feature}>
                <Text variant="body-1">
                  {t("tables.columns.labels.floors")}
                </Text>
                <Text variant="subheader-1">{blueprint.data.floors}</Text>
              </div>
              <Divider />
              <div className={st.feature}>
                <Text variant="body-1">{t("tables.columns.labels.area")}</Text>
                <Text variant="subheader-1">{blueprint.data.area}</Text>
              </div>
              <Divider />
              <div className={st.feature}>
                <Text variant="body-1">
                  {t("tables.columns.labels.material")}
                </Text>
                <Text variant="subheader-1">
                  {materialLabels[blueprint.data.material]}
                </Text>
              </div>
            </div>

            <Button
              pin="circle-circle"
              size="xl"
              view="action"
              width="max"
              onClick={() => {
                router.push(`/projects/new?blueprint_id=${blueprint.data?.id}`);
              }}
            >
              {formatter.format(blueprint.data?.price || 0)}
            </Button>
          </Card>

          <Card view="outlined" className={st.contacts}>
            <Text variant="header-2">{t("blueprints.labels.questions")}</Text>

            <TextInput size="xl" placeholder="+7 911 678-55-66" />
            <Button pin="circle-circle" size="xl" view="action">
              {t("blueprints.labels.callback")}
            </Button>
          </Card>
        </Col>
      </Row>
    </Container>
  );
});
