"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { pies, money, photo } from "@/lib/catalog";
import { useShop } from "./shop-provider";

const favorites = [pies[0], pies[1], pies[3]];
export function PieCabinet() {
  const [index, setIndex] = useState(0);
  const pie = favorites[index];
  const { add } = useShop();
  const move = (step: number) =>
    setIndex((i) => (i + step + favorites.length) % favorites.length);
  return (
    <section className="pie-house" aria-label="따우전드 파이 진열장">
      <div className="house-sign">
        <div className="sign-topline">
          <span>American pie & coffee</span>
          <span>Seoul, since 2022</span>
        </div>
        <div className="house-name" aria-hidden="true">
          THOUSAND
        </div>
        <div className="sign-baseline">
          <span />A pie house with a Seoul soul
          <span />
        </div>
      </div>
      <div className="cabinet-scene">
        <div className="cabinet-intro">
          <span className="ornament" aria-hidden="true">
            ✦
          </span>
          <p className="handwritten">Come in. Stay awhile.</p>
          <h1>
            Life tastes
            <br />
            better
            <br />
            with pie.
          </h1>
          <p className="cabinet-korean">
            오래된 취향, 새로운 한 조각.
            <br />
            서울에서 굽는 아메리칸 클래식.
          </p>
          <Link href="/shop" className="heritage-button">
            파이 컬렉션 보기 <ArrowUpRight size={17} />
          </Link>
          <div className="intro-footnote">
            <span>GUNJA</span>
            <i>·</i>
            <span>SINSA</span>
            <i>·</i>
            <span>SEONGSU</span>
          </div>
        </div>
        <div className="cabinet-center">
          <div className="cabinet-arch">
            <div className="arch-photo">
              <Image
                key={pie.slug}
                src={photo(pie.image)}
                alt={pie.name}
                fill
                priority
                sizes="(max-width: 700px) 90vw, 45vw"
              />
              <Link
                className="arch-detail"
                href={`/pies/${pie.slug}`}
                aria-label={`${pie.name} 상세 보기`}
              >
                <ArrowUpRight size={22} />
              </Link>
            </div>
            <div className="brass-plaque" aria-live="polite">
              <span>The house collection</span>
              <strong>{pie.english}</strong>
              <span>{pie.note}</span>
            </div>
          </div>
          <div className="cabinet-controls">
            <button aria-label="이전 추천 파이" onClick={() => move(-1)}>
              <ChevronLeft size={17} />
            </button>
            <div aria-label="추천 파이 선택">
              {favorites.map((p, i) => (
                <button
                  key={p.slug}
                  className="pie-dot"
                  aria-label={`${p.name} 보기`}
                  aria-pressed={i === index}
                  onClick={() => setIndex(i)}
                />
              ))}
            </div>
            <button aria-label="다음 추천 파이" onClick={() => move(1)}>
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
        <aside className="house-menu" aria-label="하우스 추천 메뉴">
          <div className="menu-pin" aria-hidden="true" />
          <span className="menu-top">A little something sweet</span>
          <h2>
            House
            <br />
            <em>favorites.</em>
          </h2>
          <div className="menu-flourish" aria-hidden="true">
            — ✦ —
          </div>
          <div className="menu-choices">
            {favorites.map((p, i) => (
              <button
                key={p.slug}
                onClick={() => setIndex(i)}
                aria-pressed={index === i}
              >
                <span>
                  <strong>{p.english.replace(" pie", "")}</strong>
                  <small>{p.name}</small>
                </span>
                <span>{money(p.price)}</span>
              </button>
            ))}
          </div>
          <p className="menu-hint">메뉴를 눌러 파이를 만나보세요.</p>
          <button
            className="menu-add"
            onClick={() => add(pie.slug)}
            aria-label={`추천 ${pie.name} 담기`}
          >
            이 파이 담기 <Plus size={16} />
          </button>
          <span className="menu-bottom">
            One slice. A thousand little joys.
          </span>
          <div className="wax-seal" aria-hidden="true">
            <span>THOUSAND</span>
            <i>T</i>
            <span>PIE HOUSE</span>
          </div>
        </aside>
      </div>
      <div className="cabinet-sill">
        <span>Good things take butter.</span>
        <a href="#collection">메뉴북 펼쳐보기 ↓</a>
        <span>Always room for one more slice.</span>
      </div>
    </section>
  );
}
