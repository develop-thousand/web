import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Catalog } from "@/components/catalog";
import { PieCabinet } from "@/components/pie-cabinet";
import { photo } from "@/lib/catalog";

export default function Home() {
  return (
    <main id="main" className="heritage-home">
      <PieCabinet />
      <section className="collection menu-book section-wrap" id="collection">
        <div className="menu-book-title">
          <span>Something for every sweet tooth</span>
          <h2>The pie menu.</h2>
          <p>취향대로 고르고, 한 조각씩 나누는 행복.</p>
          <div className="menu-book-rule" aria-hidden="true">
            ✦
          </div>
        </div>
        <Catalog compact />
        <div className="menu-colophon">
          <span>Made for your coffee break.</span>
          <span>조각마다 다른 이야기, 모두 따우전드.</span>
          <Link href="/shop">
            전체 메뉴 펼쳐보기 <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>
      <section className="editorial recipe-table">
        <div className="editorial-photo recipe-photo">
          <Image
            src={photo("ts043")}
            alt="테이블 위에 펼쳐진 다양한 따우전드 파이"
            fill
            sizes="(max-width: 700px) 90vw, 50vw"
          />
          <span className="photo-note">The more, the merrier.</span>
        </div>
        <div className="editorial-copy">
          <span className="small-note">A note from our kitchen</span>
          <h2>
            Some things
            <br />
            never get old.
          </h2>
          <p>
            좋아하는 사람과 마주 앉는 일.
            <br />
            커피가 식기 전에 파이를 한 입 베어 무는 일.
            <br />
            따우전드는 그런 오래도록 좋은 순간을 굽습니다.
          </p>
          <Link href="/story" className="underlined">
            우리의 이야기 <ArrowUpRight size={18} />
          </Link>
          <div className="editorial-sign">Yours, Thousand.</div>
          <span className="recipe-stamp" aria-hidden="true">
            GOOD PIE
            <br />
            GOOD COMPANY
          </span>
        </div>
      </section>
      <section className="store-teaser parlor section-wrap">
        <div className="section-heading">
          <div>
            <span className="parlor-eyebrow">The doors are open.</span>
            <h2>
              Behind
              <br />
              the red door.
            </h2>
          </div>
          <p>
            짙은 나무와 따뜻한 조명,
            <br />
            파이 향이 머무는 우리의 공간.
          </p>
          <Link href="/stores" className="underlined">
            매장 찾기 <ArrowUpRight size={18} />
          </Link>
        </div>
        <Link href="/stores" className="store-wide">
          <Image
            src={photo("ts-seongsoo-7")}
            alt="짙은 나무 벽과 스테인드글라스 천장이 있는 따우전드 성수 매장"
            fill
            sizes="100vw"
          />
          <div className="store-wide-caption">
            <span>Seongsu, Seoul</span>
            <h3>Pull up a chair.</h3>
            <span>
              군자 · 신사 · 성수 <ArrowUpRight size={23} />
            </span>
          </div>
        </Link>
        <div className="parlor-addresses">
          <Link href="/stores">
            <strong>Gunja</strong>
            <span>우리의 첫 번째 한 걸음</span>
          </Link>
          <Link href="/stores">
            <strong>Sinsa</strong>
            <span>도시 속 작은 파이 하우스</span>
          </Link>
          <Link href="/stores">
            <strong>Seongsu</strong>
            <span>오래 머물고 싶은 테이블</span>
          </Link>
        </div>
      </section>
      <section className="journal section-wrap">
        <div className="section-heading">
          <h2>From the scrapbook.</h2>
          <Link className="underlined" href="/story">
            더 많은 이야기 <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="journal-grid">
          <Link href="/story#journey" className="journal-card">
            <div className="journal-image">
              <Image
                src={photo("ts006")}
                alt="따우전드 파이 박스를 들고 있는 손님들"
                fill
                sizes="(max-width: 700px) 90vw, 45vw"
              />
            </div>
            <p>People & places</p>
            <h3>
              서울에서 시작된, 더 큰 테이블. <ArrowUpRight size={20} />
            </h3>
          </Link>
          <a
            href="https://www.instagram.com/fruitoftheloom.kr/reel/DQS4RQzkyIS/"
            target="_blank"
            rel="noreferrer"
            className="journal-card"
          >
            <div className="journal-image poster">
              <Image
                src={photo("collabo_fruit_3")}
                alt="프룻오브더룸과 따우전드의 Fruit of the Pie 협업 포스터"
                fill
                sizes="(max-width: 700px) 90vw, 45vw"
              />
            </div>
            <p>Collaborations</p>
            <h3>
              Two classics. One sweet story. <ArrowUpRight size={20} />
            </h3>
          </a>
        </div>
      </section>
    </main>
  );
}
