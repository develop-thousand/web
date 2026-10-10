"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, ArrowUpRight } from "lucide-react";
import { pies, photo, money, type Pie } from "@/lib/catalog";
import { useShop } from "./shop-provider";

export function PieCard({
  pie,
  priority = false,
}: {
  pie: Pie;
  priority?: boolean;
}) {
  const { add } = useShop();
  return (
    <article className="pie-card">
      <div className="pie-visual">
        <Link href={`/pies/${pie.slug}`} aria-label={`${pie.name} 상세 보기`}>
          <Image
            src={photo(pie.image)}
            alt={pie.name}
            fill
            sizes="(max-width: 600px) 50vw, (max-width: 1000px) 33vw, 25vw"
            priority={priority}
          />
        </Link>
        {pie.tag && <span className="product-tag">{pie.tag}</span>}
        <button
          className="quick-add"
          disabled={!pie.available}
          aria-label={`${pie.name} 장바구니 담기`}
          onClick={() => add(pie.slug)}
        >
          {pie.available ? <Plus size={19} /> : <span>시즌 종료</span>}
        </button>
      </div>
      <Link className="product-name" href={`/pies/${pie.slug}`}>
        <h3>{pie.english}</h3>
        <ArrowUpRight size={17} />
      </Link>
      <div className="product-meta">
        <span>{pie.name}</span>
        <span>{money(pie.price)}</span>
      </div>
    </article>
  );
}

export function Catalog({ compact = false }: { compact?: boolean }) {
  const [category, setCategory] = useState("전체");
  const [sort, setSort] = useState("추천순");
  let selected = pies.filter(
    (p) => category === "전체" || p.category === category,
  );
  if (sort === "낮은 가격순")
    selected = [...selected].sort((a, b) => a.price - b.price);
  if (sort === "높은 가격순")
    selected = [...selected].sort((a, b) => b.price - a.price);
  if (compact) selected = selected.slice(0, 4);
  return (
    <>
      <div className="catalog-tools">
        <div className="filter-tabs" role="group" aria-label="파이 종류">
          {["전체", "클래식", "크림", "시즌"].map((c) => (
            <button
              key={c}
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
            >
              {c === "전체" ? "All pies" : c}
            </button>
          ))}
        </div>
        {compact ? (
          <Link className="underlined" href="/shop">
            모든 파이 보기 <ArrowUpRight size={16} />
          </Link>
        ) : (
          <label className="sort">
            정렬{" "}
            <select
              aria-label="상품 정렬"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option>추천순</option>
              <option>낮은 가격순</option>
              <option>높은 가격순</option>
            </select>
          </label>
        )}
      </div>
      <div className="product-grid">
        {selected.map((p, i) => (
          <PieCard pie={p} key={p.slug} priority={!compact && i < 4} />
        ))}
      </div>
    </>
  );
}
