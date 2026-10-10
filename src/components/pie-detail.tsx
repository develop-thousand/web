"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Minus, Plus } from "lucide-react";
import { money, photo, type Pie } from "@/lib/catalog";
import { useShop } from "./shop-provider";

export function PieDetail({ pie }: { pie: Pie }) {
  const [quantity, setQuantity] = useState(1);
  const { add } = useShop();
  return (
    <section className="detail">
      <div className="detail-image">
        <Image
          src={photo(pie.image)}
          alt={pie.name}
          fill
          priority
          sizes="(max-width: 800px) 100vw, 55vw"
        />
      </div>
      <div className="detail-info">
        <Link href="/shop" className="breadcrumb">
          Shop / {pie.category}
        </Link>
        <span className="detail-tag">{pie.tag || "The pie collection"}</span>
        <h1>{pie.english}</h1>
        <p className="detail-korean">{pie.name}</p>
        <p className="detail-price">
          {money(pie.price)} <small>/ 조각</small>
        </p>
        <p className="detail-description">{pie.description}</p>
        <p className="flavor-note">{pie.note}</p>
        <div className="detail-options">
          <div>
            <span>판매 단위</span>
            <strong>조각 파이 1개</strong>
          </div>
          <div>
            <span>수량</span>
            <div className="quantity">
              <button
                aria-label="수량 줄이기"
                disabled={quantity <= 1}
                onClick={() => setQuantity((q) => q - 1)}
              >
                <Minus size={15} />
              </button>
              <span>{quantity}</span>
              <button
                aria-label="수량 늘리기"
                disabled={quantity >= 20}
                onClick={() => setQuantity((q) => q + 1)}
              >
                <Plus size={15} />
              </button>
            </div>
          </div>
        </div>
        <button
          className="button dark full"
          disabled={!pie.available}
          onClick={() => add(pie.slug, quantity)}
        >
          {pie.available
            ? `장바구니 담기 · ${money(pie.price * quantity)}`
            : "시즌이 돌아오면 만나요"}
          <ArrowUpRight size={18} />
        </button>
        <p className="muted detail-demo">
          샘플 가격·구성으로 구매 흐름을 체험할 수 있습니다.
        </p>
        <details open>
          <summary>픽업 및 배송 안내</summary>
          <p>
            군자·신사·성수 매장의 픽업 선택을 체험할 수 있습니다. 현재
            사이트에서 실제 예약·결제는 진행되지 않으며 택배 배송은 준비
            중입니다.
          </p>
        </details>
        <details>
          <summary>원재료·알레르기 및 보관 안내</summary>
          <p>
            원재료, 알레르기 유발 성분, 교차 접촉 여부와 보관·섭취 기한은 제품별
            공식 정보 확인이 필요합니다. 알레르기가 있다면 구매 전 매장에 문의해
            주세요. 현재 표시는 확정된 식품 표시사항이 아닙니다.
          </p>
        </details>
        <details>
          <summary>제품 사진 안내</summary>
          <p>
            브랜드 공개 사진을 사용했습니다. 홀 파이 또는 연출 사진이 포함되어
            있으며 선택한 판매 단위는 조각 1개입니다. 실제 크기와 구성은
            매장에서 확인해 주세요.
          </p>
        </details>
      </div>
    </section>
  );
}
