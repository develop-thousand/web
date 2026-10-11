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
              setSelected(
                pies.find((p) => c === categories[0] || p.category === c)!.slug,
              );
            }}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="asset-cabinet">
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
}: {
  row: number;
  items: Pie[];
  selected: string;
  setSelected: (slug: string) => void;
}) {
  const viewport = useRef<HTMLDivElement>(null);
  const buttons = useRef<Record<string, HTMLButtonElement | null>>({});
  const [edges, setEdges] = useState({ start: true, end: items.length <= 2 });
  function measure() {
    const node = viewport.current;
    if (!node) return;
    setEdges({
      start: node.scrollLeft < 2,
      end: node.scrollLeft >= node.scrollWidth - node.clientWidth - 2,
    });
  }
  function step(direction: number) {
    const node = viewport.current;
    if (!node) return;
    const first = node.querySelector<HTMLElement>(".shelf-product");
    const distance =
      (first?.offsetWidth ?? node.clientWidth / 2) + node.clientWidth * 0.02;
    node.scrollBy({
      left: direction * distance,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }
  useEffect(() => {
    const node = viewport.current;
    if (!node) return;
    const wheel = (e: WheelEvent) => {
      if (e.ctrlKey) return;
      e.preventDefault();
      const delta =
        Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const unit =
        e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? node.clientWidth : 1;
      node.scrollLeft += delta * unit;
    };
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    node.addEventListener("wheel", wheel, { passive: false });
    return () => {
      observer.disconnect();
      node.removeEventListener("wheel", wheel);
    };
  }, []);
  return (
    <div
      className={`shelf-lane lane-${row}`}
      role="group"
      aria-label={row === 0 ? "위층 파이" : "아래층 파이"}
    >
      <div className="shelf-viewport" ref={viewport} onScroll={measure}>
        <div className="continuous-shelf">
          {items.map((p) => (
            <button
              key={p.slug}
              ref={(node) => {
                buttons.current[p.slug] = node;
              }}
              className={`shelf-product ${selected === p.slug ? "is-active" : ""}`}
              aria-label={`${p.name} 선택`}
              aria-pressed={selected === p.slug}
              onFocus={() => setSelected(p.slug)}
              onClick={() => setSelected(p.slug)}
              onKeyDown={(e) => {
                if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
                e.preventDefault();
                const next = Math.max(
                  0,
                  Math.min(
                    items.length - 1,
                    items.indexOf(p) + (e.key === "ArrowRight" ? 1 : -1),
                  ),
                );
                setSelected(items[next].slug);
                requestAnimationFrame(() =>
                  buttons.current[items[next].slug]?.focus({
                    preventScroll: false,
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
      {items.length > 2 && (
        <div className="shelf-paging">
          <button
            aria-label={`이전 파이: ${row + 1}`}
            disabled={edges.start}
            onClick={() => step(-1)}
          >
            <ChevronLeft />
          </button>
          <button
            aria-label={`다음 파이: ${row + 1}`}
            disabled={edges.end}
            onClick={() => step(1)}
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}
