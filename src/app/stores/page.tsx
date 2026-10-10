import type { Metadata } from "next";
import { StoreLocator } from "@/components/store-locator";
export const metadata: Metadata = { title: "매장 찾기" };
export default function StoresPage() {
  return (
    <main id="main" className="section-wrap stores-page">
      <div className="page-heading">
        <span>Find a pie house</span>
        <h1>
          A place
          <br />
          for good times.
        </h1>
        <p>
          가까운 따우전드에서 만나요.
          <br />
          파이와 커피, 그리고 잠시 머물고 싶은 공간.
        </p>
      </div>
      <StoreLocator />
    </main>
  );
}
