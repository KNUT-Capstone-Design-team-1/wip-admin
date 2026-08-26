import type { Metadata } from "next";
import ThemeRegistry from "@/shared/components/ThemeRegistry";
import QueryProvider from "@/shared/components/QueryProvider";

export const metadata: Metadata = {
  title: "WIP 관리자 페이지",
  description: "WIP 어플리케이션 관리자 대시보드",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <QueryProvider>
          <ThemeRegistry>{children}</ThemeRegistry>
        </QueryProvider>
      </body>
    </html>
  );
}
