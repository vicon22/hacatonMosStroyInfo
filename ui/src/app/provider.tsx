"use client";

import { memo, ReactNode, useMemo } from "react";
import { I18nextProvider } from "react-i18next";
import { Langs } from "@/features/appearance/types";
import { init } from "@/i18n/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/configs/queryClient";
import {
  ThemeProvider,
  Toaster,
  ToasterComponent,
  ToasterProvider,
} from "@gravity-ui/uikit";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

type ProvidersProps = {
  children: ReactNode;
  lang: Langs;
};

const toaster = new Toaster();

export const Providers = memo(function Providers(props: ProvidersProps) {
  const provider = useMemo(() => init(props.lang), [props.lang]);

  return (
    <QueryClientProvider client={getQueryClient()}>
      <I18nextProvider i18n={provider}>
        <ThemeProvider theme="dark">
          <ToasterProvider toaster={toaster}>
            {props.children}
            <ToasterComponent />
          </ToasterProvider>
        </ThemeProvider>
      </I18nextProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
});
