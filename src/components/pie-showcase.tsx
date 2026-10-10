"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { pies, money } from "@/lib/catalog";
import { useShop } from "./shop-provider";

export const pieAsset = (slug: string) => `/images/atelier/${slug}.png`;

export function PieShowcase() {
  const [selected, setSelected] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const { add } = useShop();
  const active = hovered ?? selected;
  const pie = pies[active];

  return (
    <section className="pie-atelier" aria-label="따우전드 파이 진열장">
      <div className="atelier-heading">
        <div>
          <p>서울에서 굽는 아메리칸 클래식</p>
          <h1>THE PIE ROOM</h1>
        </div>
        <p className="atelier-intro">
          눈길이 머무는 파이,
          <br />
          당신의 한 조각을 골라보세요.
        </p>
      </div>
      <div
        className={`asset-cabinet ${hovered !== null ? "is-exploring" : ""}`}
      >
        <Image
          className="empty-cabinet"
          src="/images/atelier/cabinet.png"
          alt=""
          fill
          priority
          sizes="100vw"
          aria-hidden="true"
        />
        <div className="cabinet-glass" aria-hidden="true" />
        <div className="asset-shelves" role="group" aria-label="파이 컬렉션">
          {[0, 1].map((row) => (
            <div className={`asset-shelf shelf-${row}`} key={row}>
              {pies.slice(row * 4, row * 4 + 4).map((p, col) => {
                const index = row * 4 + col;
                return (
                  <button
                    key={p.slug}
                    ref={(node) => {
                      buttons.current[index] = node;
                    }}
                    className={`shelf-product ${active === index ? "is-active" : ""}`}
                    aria-label={`${p.name} 선택`}
                    aria-pressed={selected === index}
                    onPointerEnter={(e) => {
                      if (e.pointerType === "mouse") {
                        setHovered(index);
                        setSelected(index);
                      }
                    }}
                    onPointerLeave={() => setHovered(null)}
                    onFocus={() => {
                      setHovered(index);
                      setSelected(index);
                    }}
                    onBlur={() => setHovered(null)}
                    onClick={() => setSelected(index)}
                    onKeyDown={(e) => {
                      const steps: Record<string, number> = {
                        ArrowRight: 1,
                        ArrowLeft: -1,
                        ArrowDown: 4,
                        ArrowUp: -4,
                      };
                      if (e.key in steps) {
                        e.preventDefault();
                        const next =
                          (index + steps[e.key] + pies.length) % pies.length;
                        setSelected(next);
                        buttons.current[next]?.focus();
                      }
                    }}
                  >
                    <span className="pie-object">
                      <Image
                        src={pieAsset(p.slug)}
                        alt={p.name}
                        fill
                        priority={row === 0}
                        sizes="(max-width:700px) 42vw, 23vw"
                      />
                      <span className="object-shadow" />
                    </span>
                    <span className="shelf-label">
                      <strong>{p.name}</strong>
                      <span>{p.available ? money(p.price) : "시즌 종료"}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        <div className="cabinet-signature" aria-hidden="true">
          THOUSAND <span>AMERICAN PIE HOUSE</span>
        </div>
      </div>
      <div className="atelier-selection">
        <div className="selection-copy" aria-live="polite" aria-atomic="true">
          <span className="selection-category">{pie.category}</span>
          <h2>{pie.name}</h2>
          <p>{pie.note}</p>
        </div>
        <div className="selection-actions">
          <p>
            {money(pie.price)}
            <span> / 조각</span>
          </p>
          <Link href={`/pies/${pie.slug}`}>
            자세히 보기 <ArrowUpRight size={16} />
          </Link>
          <button
            disabled={!pie.available}
            onClick={() => add(pie.slug)}
            aria-label={`선택한 ${pie.name} 담기`}
          >
            {pie.available ? "한 조각 담기" : "시즌 종료"}
            <Plus size={17} />
          </button>
        </div>
      </div>
    </section>
  );
}
