import type { Metadata } from "next";
import { init } from "@/i18n/server";
import { cookies } from "next/headers";
import { langCookie, stringToLang } from "@/features/appearance/utils";
import { Providers } from "./provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Former app",
  description: "House building application",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const requestCookise = await cookies();
  const lc = requestCookise.get(langCookie);
  const lang = stringToLang(lc?.value);

  await init(stringToLang(lang));

  return (
    <html lang={lang}>
      <body className="g-root g-root_theme_dark">
        <Providers lang={lang}>{children}</Providers>
      </body>
    </html>
  );
}
