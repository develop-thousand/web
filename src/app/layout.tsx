import type { Metadata } from "next";
import { Header, Footer } from "@/components/chrome";
import { ShopProvider } from "@/components/shop-provider";
import "./globals.css";
import "./atelier.css";

export const metadata: Metadata = {
  title: {
    default: "THOUSAND — A pie house from Seoul",
    template: "%s | THOUSAND",
  },
  description:
    "서울에서 시작된 아메리칸 파이 하우스. 따우전드의 파이 컬렉션과 군자·신사·성수 매장을 만나보세요.",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <ShopProvider>
          <Header />
          {children}
          <Footer />
        </ShopProvider>
      </body>
    </html>
  );
}
