"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { pies, money, type Pie } from "@/lib/catalog";
import { useShop } from "./shop-provider";
export const pieAsset = (slug: string) => `/images/atelier/${slug}.png`;
const categories = ["전체", "크림", "클래식", "시즌"];

export function PieShowcase() {
  const [category, setCategory] = useState(categories[0]);
  const [selected, setSelected] = useState(pies[0].slug);
  const [hovered, setHovered] = useState<string | null>(null);
  const { add } = useShop();
  const filtered = useMemo(
    () =>
      pies.filter((p) => category === categories[0] || p.category === category),
    [category],
  );
  const rows = [
    filtered.filter((_, i) => i % 4 < 2),
    filtered.filter((_, i) => i % 4 >= 2),
  ];
  const pie = pies.find((p) => p.slug === selected)!;
  return (
    <section className="pie-atelier">
      <div className="atelier-heading">
        <h1>THE PIE ROOM</h1>
      </div>
      <div className="cabinet-filters">
        {categories.map((c) => (
          <button
            key={c}
            aria-pressed={category === c}
            onClick={() => {
              setCategory(c);
              setHovered(null);
              setSelected(
                pies.find((p) => c === categories[0] || p.category === c)!.slug,
              );
            }}
          >
            {c}
          </button>
        ))}
      </div>
      <div className={`asset-cabinet ${hovered ? "is-exploring" : ""}`}>
        <Image
          className="empty-cabinet"
          src="/images/atelier/cabinet.png"
          alt=""
          fill
          priority
          sizes="100vw"
        />
        {rows.map((items, row) => (
          <Shelf
            key={`${category}-${row}`}
            row={row}
            items={items}
            selected={selected}
            setSelected={setSelected}
            setHovered={setHovered}
          />
        ))}
        <div className="cabinet-glass" aria-hidden="true" />
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

function Shelf({
  row,
  items,
  selected,
  setSelected,
  setHovered,
}: {
  row: number;
  items: Pie[];
  selected: string;
  setSelected: (slug: string) => void;
  setHovered: (slug: string | null) => void;
}) {
  const [page, setPage] = useState(0);
  const lane = useRef<HTMLDivElement>(null);
  const lastWheel = useRef(0);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const buttons = useRef<Record<string, HTMLButtonElement | null>>({});
  const count = Math.ceil(items.length / 2);
  function go(next: number) {
    const target = Math.max(0, Math.min(count - 1, next));
    setPage(target);
    setHovered(null);
    if (items[target * 2]) setSelected(items[target * 2].slug);
  }
  useEffect(() => {
    const node = lane.current;
    if (!node) return;
    let distance = 0;
    const wheel = (e: WheelEvent) => {
      if (e.ctrlKey) return;
      e.preventDefault();
      if (Date.now() - lastWheel.current < 850 || !count) return;
      distance += Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(distance) < 45) return;
      const next = Math.max(0, Math.min(count - 1, page + Math.sign(distance)));
      distance = 0;
      lastWheel.current = Date.now();
      setPage(next);
      setHovered(null);
      setSelected(items[next * 2].slug);
    };
    node.addEventListener("wheel", wheel, { passive: false });
    return () => node.removeEventListener("wheel", wheel);
  }, [page, count, items, setHovered, setSelected]);
  return (
    <div
      ref={lane}
      className={`shelf-lane lane-${row}`}
      role="group"
      aria-label={row === 0 ? "위층 파이" : "아래층 파이"}
      onTouchStart={(e) => {
        touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }}
      onTouchEnd={(e) => {
        if (!touch.current) return;
        const dx = touch.current.x - e.changedTouches[0].clientX;
        const dy = touch.current.y - e.changedTouches[0].clientY;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) && count)
          go(page + Math.sign(dx));
        touch.current = null;
      }}
    >
      <div className="shelf-viewport">
        <div
          className="cabinet-track"
          style={{ transform: `translateX(-${page * 100}%)` }}
        >
          {Array.from({ length: count }, (_, index) => (
            <div
              className="cabinet-bay"
              key={index}
              inert={index !== page}
              aria-hidden={index !== page}
            >
              <div className="asset-shelf">
                {items.slice(index * 2, index * 2 + 2).map((p) => (
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
                      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft")
                        return;
                      e.preventDefault();
                      const next = Math.max(
                        0,
                        Math.min(
                          items.length - 1,
                          items.indexOf(p) + (e.key === "ArrowRight" ? 1 : -1),
                        ),
                      );
                      setPage(Math.floor(next / 2));
                      setSelected(items[next].slug);
                      requestAnimationFrame(() =>
                        buttons.current[items[next].slug]?.focus({
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
                      <span>{p.available ? money(p.price) : "시즌 종료"}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {count > 1 && (
        <div className="shelf-paging">
          <button
            aria-label={`이전 파이: ${row + 1}`}
            disabled={page === 0}
            onClick={() => go(page - 1)}
          >
            <ChevronLeft />
          </button>
          <span aria-live="polite">
            {page + 1} / {count}
          </span>
          <button
            aria-label={`다음 파이: ${row + 1}`}
            disabled={page === count - 1}
            onClick={() => go(page + 1)}
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}
