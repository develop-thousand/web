"use client";

import { useRef, useState, type PointerEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  Maximize2,
  Minimize2,
  Plus,
  LayoutGrid,
  Layers,
} from "lucide-react";
import { pies, photo, money } from "@/lib/catalog";
import { useShop } from "./shop-provider";

const collection = [pies[0], pies[1], pies[3], pies[5]];

export function PieStudio() {
  const [selected, setSelected] = useState(0);
  const [spread, setSpread] = useState(false);
  const [zoom, setZoom] = useState(false);
  const start = useRef<{ x: number; y: number } | null>(null);
  const { add } = useShop();
  const pie = collection[selected];
  const move = (direction: number) => {
    setSelected((i) => (i + direction + collection.length) % collection.length);
    setZoom(false);
  };
  function finishSwipe(event: PointerEvent<HTMLDivElement>) {
    if (!start.current) return;
    const dx = event.clientX - start.current.x;
    const dy = event.clientY - start.current.y;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 1 : -1);
    start.current = null;
  }

  return (
    <section
      className={`pie-studio ${spread ? "is-spread" : "is-focus"}`}
      aria-label="파이 인터랙티브 갤러리"
    >
      <div className="studio-toolbar">
        <p>파이를 고르는 조금 다른 방법.</p>
        <div className="view-switch" role="group" aria-label="파이 보기 방식">
          <button aria-pressed={!spread} onClick={() => setSpread(false)}>
            <Layers size={15} />
            하나씩 보기
          </button>
          <button
            aria-pressed={spread}
            onClick={() => {
              setSpread(true);
              setZoom(false);
            }}
          >
            <LayoutGrid size={15} />
            펼쳐 보기
          </button>
        </div>
      </div>
      <div className="studio-body">
        <div className="studio-copy">
          <h1>
            PIE.
            <br />
            <span>UNBOXED.</span>
          </h1>
          <p className="studio-manifesto">
            익숙한 파이.
            <br />
            상자 밖의 새로운 취향.
          </p>
          <Link href="/shop" className="studio-shop">
            컬렉션 쇼핑하기 <ArrowUpRight size={21} />
          </Link>
          <div className="studio-micro">
            <span>American classics.</span>
            <span>Seoul state of mind.</span>
          </div>
        </div>
        {spread ? (
          <div className="spread-board" aria-label="펼쳐진 파이 컬렉션">
            {collection.map((p, i) => (
              <button
                className={`spread-print print-${i}`}
                key={p.slug}
                aria-label={`${p.name} 집중해서 보기`}
                onClick={() => {
                  setSelected(i);
                  setSpread(false);
                }}
              >
                <div>
                  <Image
                    src={photo(p.image)}
                    alt={p.name}
                    fill
                    sizes="(max-width: 700px) 43vw, 25vw"
                  />
                </div>
                <span>
                  <strong>{p.english}</strong>
                  <ArrowUpRight size={16} />
                </span>
                <small>{money(p.price)}</small>
              </button>
            ))}
            <p className="spread-note">Pick a pie. Make it yours.</p>
          </div>
        ) : (
          <div className="focus-board">
            <div className="background-print" aria-hidden="true">
              <Image
                src={photo(
                  collection[(selected + 1) % collection.length].image,
                )}
                alt=""
                fill
                sizes="25vw"
              />
            </div>
            <div className="focus-print">
              <div
                className={`focus-photo ${zoom ? "is-zoomed" : ""}`}
                tabIndex={0}
                role="group"
                aria-label="파이 사진. 좌우 방향키 또는 좌우 스와이프로 다음 파이를 볼 수 있습니다."
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight") {
                    e.preventDefault();
                    move(1);
                  }
                  if (e.key === "ArrowLeft") {
                    e.preventDefault();
                    move(-1);
                  }
                }}
                onPointerDown={(e) => {
                  start.current = { x: e.clientX, y: e.clientY };
                  e.currentTarget.setPointerCapture(e.pointerId);
                }}
                onPointerUp={finishSwipe}
                onPointerCancel={() => {
                  start.current = null;
                }}
                onPointerMove={(e) => {
                  if (!zoom || e.pointerType === "touch") return;
                  const r = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty(
                    "--photo-x",
                    `${((e.clientX - r.left) / r.width) * 100}%`,
                  );
                  e.currentTarget.style.setProperty(
                    "--photo-y",
                    `${((e.clientY - r.top) / r.height) * 100}%`,
                  );
                }}
              >
                <Image
                  key={pie.slug}
                  src={photo(pie.image)}
                  alt={pie.name}
                  fill
                  priority
                  draggable={false}
                  sizes="(max-width: 700px) 88vw, 48vw"
                />
                <span className="photo-corner">
                  THOUSAND
                  <br />
                  PIE COLLECTION
                </span>
              </div>
              <div className="print-bottom">
                <span>Too good to stay in a box.</span>
                <button aria-pressed={zoom} onClick={() => setZoom((z) => !z)}>
                  {zoom ? <Minimize2 size={15} /> : <Maximize2 size={15} />}{" "}
                  {zoom ? "전체 보기" : "디테일 보기"}
                </button>
              </div>
            </div>
            <button
              className="unbox-sticker"
              onClick={() => {
                setSpread(true);
                setZoom(false);
              }}
            >
              <span>다른 취향도</span>
              <strong>
                UNBOX
                <br />
                YOUR PIE
              </strong>
              <span>펼쳐 보기 ↗</span>
            </button>
            <div className="pie-coordinate">
              <span>{String(selected + 1).padStart(2, "0")}</span>
              <i>/</i>
              <span>04</span>
            </div>
          </div>
        )}
      </div>
      <div className="studio-bottom">
        <div className="studio-selection" aria-live="polite">
          <span>Selected pie</span>
          <Link href={`/pies/${pie.slug}`} className="selected-detail">
            <strong>{pie.english}</strong>
            <ArrowUpRight size={23} />
          </Link>
          <p>
            {pie.name} <span>{money(pie.price)} / 조각</span>
          </p>
        </div>
        <div className="flavor-strip" role="group" aria-label="추천 파이 선택">
          {collection.map((p, i) => (
            <button
              key={p.slug}
              aria-label={`${p.name} 선택`}
              aria-pressed={selected === i}
              onClick={() => {
                setSelected(i);
                setSpread(false);
                setZoom(false);
              }}
            >
              <Image src={photo(p.image)} alt="" width={52} height={62} />
            </button>
          ))}
        </div>
        <div className="studio-actions">
          <div className="studio-arrows">
            <button aria-label="이전 추천 파이" onClick={() => move(-1)}>
              <ArrowLeft size={20} />
            </button>
            <button aria-label="다음 추천 파이" onClick={() => move(1)}>
              <ArrowRight size={20} />
            </button>
          </div>
          <button
            className="studio-add"
            onClick={() => add(pie.slug)}
            aria-label={`추천 ${pie.name} 담기`}
          >
            이 파이 담기 <Plus size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
