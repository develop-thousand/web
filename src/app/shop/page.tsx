import type { Metadata } from "next";
import { Catalog } from "@/components/catalog";
export const metadata: Metadata = { title: "파이 컬렉션" };
export default function Shop() {
  return (
    <main id="main" className="section-wrap shop-page">
      <div className="page-heading">
        <span>The collection</span>
        <h1>
          In the mood
          <br />
          for pie.
        </h1>
        <p>
          익숙한 클래식부터 계절을 담은 한 조각까지.
          <br />
          오늘의 기분에 어울리는 파이를 만나보세요.
        </p>
      </div>
      <Catalog />
      <p className="catalog-disclaimer">
        표시 가격은 공개 메뉴를 참고한 시연용 가격입니다. 실제 판매
        메뉴·가격·구성은 매장에서 확인해 주세요.
      </p>
    </main>
  );
}
