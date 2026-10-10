"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Plus,
  Pause,
  Play,
} from "lucide-react";
import { pies, photo, money } from "@/lib/catalog";
import { useShop } from "./shop-provider";

const display = [
  { slug: "banana-cream", x: 24, y: 59 },
  { slug: "mud", x: 63, y: 53 },
  { slug: "pecan", x: 18, y: 83 },
  { slug: "blueberry", x: 59, y: 87 },
  { slug: "pumpkin", x: 79, y: 87 },
].map((position) => ({
  ...position,
  pie: pies.find((p) => p.slug === position.slug)!,
}));

export function PieShowcase() {
  const [selected, setSelected] = useState(0);
  const [motion, setMotion] = useState(true);
  const { add } = useShop();
  const item = display[selected];
  const choose = (direction: number) =>
    setSelected((i) => (i + direction + display.length) % display.length);

  return (
    <section
      className={`showroom ${motion ? "" : "motion-off"}`}
      aria-label="따우전드 파이 진열장"
    >
      <div className="showroom-welcome">
        <div className="welcome-note">
          <span>From our counter,</span>
          <span>to your kind of day.</span>
        </div>
        <div className="showroom-title">
          <p>THOUSAND AMERICAN PIE HOUSE</p>
          <h1>A little slice of happiness.</h1>
        </div>
        <Link href="/stores" className="visit-note">
          매장에서 만나요
          <ArrowUpRight size={18} />
        </Link>
      </div>
      <div className="counter-frame">
        <div className="counter-canopy">
          <span>Homemade spirit. Seoul soul.</span>
          <p>마음에 드는 파이를 골라보세요.</p>
          <button
            onClick={() => setMotion((v) => !v)}
            aria-pressed={!motion}
            aria-label={motion ? "모션 끄기" : "모션 켜기"}
          >
            {motion ? <Pause size={13} /> : <Play size={13} />}
            <span>모션 {motion ? "켜짐" : "꺼짐"}</span>
          </button>
        </div>
        <div className="counter-interior">
          <div
            className="cabinet-scene"
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") {
                e.preventDefault();
                choose(1);
              }
              if (e.key === "ArrowLeft") {
                e.preventDefault();
                choose(-1);
              }
            }}
            role="group"
            aria-label="진열장의 상품 선택. 좌우 방향키로도 이동할 수 있습니다."
          >
            <Image
              className="cabinet-photo"
              src="/images/pie-showcase-reference.png"
              alt="황동 프레임과 따뜻한 조명이 있는 따우전드 실제 파이 진열장"
              fill
              priority
              sizes="(max-width: 800px) 100vw, 72vw"
            />
            <div className="cabinet-shade" aria-hidden="true" />
            <div
              className="cabinet-focus"
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
              aria-hidden="true"
            />
            <div className="glass-reflection" aria-hidden="true" />
            <div className="cabinet-light" aria-hidden="true" />
            {display.map((entry, i) => (
              <button
                key={entry.slug}
                className={`pie-pin ${selected === i ? "chosen" : ""}`}
                style={
                  {
                    "--pin-x": `${entry.x}%`,
                    "--pin-y": `${entry.y}%`,
                  } as CSSProperties
                }
                aria-label={`${entry.pie.name} 선택`}
                aria-pressed={selected === i}
                onClick={() => setSelected(i)}
              >
                <span className="pin-dot">
                  <Plus size={13} />
                </span>
                <span className="pin-name">{entry.pie.name}</span>
              </button>
            ))}
            <div className="counter-hint">
              <span className="hint-dot" />
              파이 위의 +를 눌러보세요
            </div>
            <button
              className="cabinet-next"
              aria-label="다음 진열 파이"
              onClick={() => choose(1)}
            >
              <ArrowRight size={19} />
            </button>
          </div>
          <aside className="counter-product" aria-label="선택한 파이">
            <div className="counter-product-top">
              <span>Your pick</span>
              <div>
                <button aria-label="이전 진열 파이" onClick={() => choose(-1)}>
                  <ArrowLeft size={17} />
                </button>
                <span>
                  {selected + 1} / {display.length}
                </span>
                <button aria-label="다음 상품" onClick={() => choose(1)}>
                  <ArrowRight size={17} />
                </button>
              </div>
            </div>
            <div className="counter-product-reveal" key={item.slug}>
              <Link
                className="counter-closeup"
                href={`/pies/${item.slug}`}
                aria-label={`${item.pie.name} 상세 보기`}
              >
                <Image
                  src={photo(item.pie.image)}
                  alt={item.pie.name}
                  fill
                  sizes="(max-width: 800px) 44vw, 25vw"
                />
                <span>
                  자세히 보기 <ArrowUpRight size={15} />
                </span>
              </Link>
              <div
                className="counter-product-copy"
                aria-live="polite"
                aria-atomic="true"
              >
                <p className="pie-english">{item.pie.english}</p>
                <h2>{item.pie.name}</h2>
                <p className="pie-taste">{item.pie.note}</p>
                <p className="counter-price">
                  {money(item.pie.price)}
                  <span> / 조각</span>
                </p>
              </div>
            </div>
            <button
              className="counter-add"
              onClick={() => add(item.slug)}
              aria-label={`선택한 ${item.pie.name} 담기`}
            >
              이 파이 담기 <Plus size={20} />
            </button>
            <Link className="counter-all" href="/shop">
              전체 파이 메뉴 <ArrowUpRight size={16} />
            </Link>
          </aside>
        </div>
        <div className="counter-plinth">
          <span>THOUSAND</span>
          <p>좋아하는 한 조각을 만나는 곳.</p>
          <span>Est. Seoul 2022</span>
        </div>
      </div>
      <div className="showroom-foot">
        <span>군자 · 신사 · 성수</span>
        <p>따뜻한 공간, 달콤한 취향. 따우전드에 오신 걸 환영합니다.</p>
        <a href="#collection">메뉴 더 둘러보기 ↓</a>
      </div>
    </section>
  );
}
