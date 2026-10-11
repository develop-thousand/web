"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { pies, money } from "@/lib/catalog";
import { useShop } from "./shop-provider";
export const pieAsset = (slug: string) => `/images/atelier/${slug}.png`;
const categories = ["전체", "크림", "클래식", "시즌"];

export function PieShowcase() {
  const [category, setCategory] = useState("전체");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState(pies[0].slug);
  const [hovered, setHovered] = useState<string | null>(null);
  const scene = useRef<HTMLDivElement>(null);
  const lastWheel = useRef(0);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const buttons = useRef<Record<string, HTMLButtonElement | null>>({});
  const { add } = useShop();
  const filtered = useMemo(
    () => pies.filter((p) => category === "전체" || p.category === category),
    [category],
  );
  const count = Math.ceil(filtered.length / 4);
  const pie = pies.find((p) => p.slug === selected)!;
  function go(next: number) {
    const target = Math.max(0, Math.min(count - 1, next));
    setPage(target);
    setHovered(null);
    setSelected(filtered[target * 4].slug);
  }
  useEffect(() => {
    const node = scene.current;
    if (!node) return;
    let distance = 0;
    const wheel = (event: WheelEvent) => {
      if (event.ctrlKey) return;
      event.preventDefault();
      if (Date.now() - lastWheel.current < 850) return;
      distance +=
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY;
      if (Math.abs(distance) < 45) return;
      const next = Math.max(0, Math.min(count - 1, page + Math.sign(distance)));
      distance = 0;
      lastWheel.current = Date.now();
      setPage(next);
      setHovered(null);
      setSelected(filtered[next * 4].slug);
    };
    node.addEventListener("wheel", wheel, { passive: false });
    return () => node.removeEventListener("wheel", wheel);
  }, [page, count, filtered]);
  return (
    <section className="pie-atelier" aria-label="따우전드 파이 진열장">
      <div className="atelier-heading">
        <h1>THE PIE ROOM</h1>
      </div>
      <div className="cabinet-filters" aria-label="파이 종류">
        {categories.map((c) => (
          <button
            key={c}
            aria-pressed={category === c}
            onClick={() => {
              setCategory(c);
              setPage(0);
              setHovered(null);
              setSelected(
                pies.find((p) => c === "전체" || p.category === c)!.slug,
              );
            }}
          >
            {c}
          </button>
        ))}
      </div>
      <div
        ref={scene}
        className={`asset-cabinet ${hovered ? "is-exploring" : ""}`}
        onTouchStart={(e) => {
          touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }}
        onTouchEnd={(e) => {
          if (!touch.current) return;
          const dx = touch.current.x - e.changedTouches[0].clientX;
          const dy = touch.current.y - e.changedTouches[0].clientY;
          if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy))
            go(page + Math.sign(dx));
          touch.current = null;
        }}
      >
        <Image
          className="empty-cabinet"
          src="/images/atelier/cabinet.png"
          alt=""
          fill
          priority
          sizes="100vw"
        />
        <div
          className="cabinet-track"
          style={{ transform: `translateX(-${page * 100}%)` }}
        >
          {Array.from({ length: count }, (_, cabinet) => (
            <div
              className="cabinet-bay"
              key={`${category}-${cabinet}`}
              inert={cabinet !== page}
              aria-hidden={cabinet !== page}
            >
              <div
                className="asset-shelves"
                role="group"
                aria-label={`진열장 ${cabinet + 1}`}
              >
                {[0, 1].map((row) => (
                  <div className={`asset-shelf shelf-${row}`} key={row}>
                    {filtered
                      .slice(cabinet * 4 + row * 2, cabinet * 4 + row * 2 + 2)
                      .map((p) => (
                        <button
                          key={p.slug}
                          ref={(node) => {
                            buttons.current[p.slug] = node;
                          }}
                          className={`shelf-product ${selected === p.slug ? "is-active" : ""}`}
                          aria-label={`${p.name} 선택`}
                          aria-pressed={selected === p.slug}
                          onPointerEnter={(e) => {
                            if (e.pointerType === "mouse") {
                              setHovered(p.slug);
                              setSelected(p.slug);
                            }
                          }}
                          onPointerLeave={() => setHovered(null)}
                          onFocus={() => {
                            setHovered(p.slug);
                            setSelected(p.slug);
                          }}
                          onBlur={() => setHovered(null)}
                          onClick={() => setSelected(p.slug)}
                          onKeyDown={(e) => {
                            const steps: Record<string, number> = {
                              ArrowRight: 1,
                              ArrowLeft: -1,
                              ArrowDown: 2,
                              ArrowUp: -2,
                            };
                            if (!(e.key in steps)) return;
                            e.preventDefault();
                            const next = Math.max(
                              0,
                              Math.min(
                                filtered.length - 1,
                                filtered.indexOf(p) + steps[e.key],
                              ),
                            );
                            setPage(Math.floor(next / 4));
                            setSelected(filtered[next].slug);
                            requestAnimationFrame(() =>
                              buttons.current[filtered[next].slug]?.focus({
                                preventScroll: true,
                              }),
                            );
                          }}
                        >
                          <span className="pie-object">
                            <Image
                              src={pieAsset(p.slug)}
                              alt={p.name}
                              fill
                              priority
                              sizes="(max-width:700px) 44vw, 38vw"
                            />
                            <span className="object-shadow" />
                          </span>
                          <span className="shelf-label">
                            <strong>{p.name}</strong>
                            <span>
                              {p.available ? money(p.price) : "시즌 종료"}
                            </span>
                          </span>
                        </button>
                      ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="cabinet-glass" aria-hidden="true" />
        <div className="cabinet-paging">
          <button
            aria-label="이전 진열장"
            disabled={page === 0}
            onClick={() => go(page - 1)}
          >
            <ChevronLeft />
          </button>
          <span aria-live="polite">
            {page + 1} / {count}
          </span>
          <button
            aria-label="다음 진열장"
            disabled={page === count - 1}
            onClick={() => go(page + 1)}
          >
            <ChevronRight />
          </button>
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
