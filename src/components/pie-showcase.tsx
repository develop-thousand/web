"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Plus, ChevronLeft, ChevronRight, X } from "lucide-react";
import { pies, money, type Pie } from "@/lib/catalog";
import { useShop } from "./shop-provider";
export const pieAsset = (slug: string) => `/images/atelier/${slug}.png`;
const categories = ["전체", "크림", "클래식", "시즌"];

export function PieShowcase() {
  const [category, setCategory] = useState(categories[0]);
  const [selected, setSelected] = useState(pies[0].slug);
  const { add } = useShop();
  const detail = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  function openDetail(slug: string, button: HTMLButtonElement) {
    setSelected(slug);
    opener.current = button;
    detail.current?.showModal();
  }
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
            openDetail={openDetail}
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
      <dialog
        ref={detail}
        className="pie-preview"
        aria-labelledby="pie-preview-title"
        onClose={() => opener.current?.focus({ preventScroll: true })}
        onClick={(e) => {
          if (e.target === e.currentTarget) detail.current?.close();
        }}
      >
        <div className="pie-preview-content">
          <button
            className="preview-close"
            aria-label="상세 닫기"
            onClick={() => detail.current?.close()}
          >
            <X size={22} />
          </button>
          <div className="preview-image">
            <Image
              src={pieAsset(pie.slug)}
              alt={pie.name}
              fill
              sizes="(max-width:700px) 85vw, 340px"
            />
          </div>
          <div className="preview-copy">
            <span>{pie.category}</span>
            <h2 id="pie-preview-title">{pie.name}</h2>
            <p className="preview-note">{pie.note}</p>
            <p>{pie.description}</p>
            <strong className="preview-price">{money(pie.price)}</strong>
            <button
              className="preview-add button dark"
              disabled={!pie.available}
              onClick={() => {
                detail.current?.close();
                add(pie.slug);
              }}
            >
              {pie.available ? "한 조각 담기" : "시즌 종료"}
            </button>
            <Link
              href={`/pies/${pie.slug}`}
              onClick={() => detail.current?.close()}
            >
              상품 페이지 보기 <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </dialog>
    </section>
  );
}

function Shelf({
  row,
  items,
  selected,
  setSelected,
  openDetail,
}: {
  row: number;
  items: Pie[];
  selected: string;
  setSelected: (slug: string) => void;
  openDetail: (slug: string, button: HTMLButtonElement) => void;
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
    let drag: { id: number; x: number; scroll: number; moved: boolean } | null =
      null;
    let suppressClick = false;
    const down = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      // Keep pointer focus from selecting a product before a drag is distinguished.
      e.preventDefault();
      suppressClick = false;
      node.scrollTo({ left: node.scrollLeft, behavior: "instant" });
      drag = {
        id: e.pointerId,
        x: e.clientX,
        scroll: node.scrollLeft,
        moved: false,
      };
    };
    const move = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      const distance = e.clientX - drag.x;
      if (!drag.moved && Math.abs(distance) < 5) return;
      if (!drag.moved) {
        drag.moved = true;
        suppressClick = true;
        node.setPointerCapture(e.pointerId);
        node.classList.add("is-dragging");
      }
      node.scrollLeft = drag.scroll - distance;
    };
    const finish = () => {
      if (drag && node.hasPointerCapture(drag.id))
        node.releasePointerCapture(drag.id);
      drag = null;
      node.classList.remove("is-dragging");
    };
    const up = (e: PointerEvent) => {
      if (drag?.id === e.pointerId) finish();
    };
    const click = (e: MouseEvent) => {
      if (suppressClick && e.detail !== 0) {
        e.preventDefault();
        e.stopPropagation();
        suppressClick = false;
      }
    };
    const nativeDrag = (e: DragEvent) => e.preventDefault();
    node.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    window.addEventListener("blur", finish);
    node.addEventListener("lostpointercapture", finish);
    node.addEventListener("click", click, true);
    node.addEventListener("dragstart", nativeDrag);
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    node.addEventListener("wheel", wheel, { passive: false });
    return () => {
      finish();
      node.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      window.removeEventListener("blur", finish);
      node.removeEventListener("lostpointercapture", finish);
      node.removeEventListener("click", click, true);
      node.removeEventListener("dragstart", nativeDrag);
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
              onClick={(e) => openDetail(p.slug, e.currentTarget)}
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
