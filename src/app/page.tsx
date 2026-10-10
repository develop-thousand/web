import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Catalog } from "@/components/catalog";
import { photo } from "@/lib/catalog";

export default function Home() {
  return (
    <main id="main">
      <section className="hero" aria-label="따우전드 파이 컬렉션">
        <div className="hero-main">
          <Image
            src={photo("ts044")}
            alt="크림이 풍성하게 올라간 따우전드의 다양한 홀 파이"
            fill
            priority
            sizes="(max-width: 700px) 100vw, 65vw"
          />
          <div className="hero-shade" />
          <div className="hero-caption">
            <p>American classics, reimagined.</p>
            <h1>
              A little slice.
              <br />A whole feeling.
            </h1>
            <Link href="/shop" className="button light">
              파이 쇼핑하기 <ArrowUpRight size={19} />
            </Link>
          </div>
          <span className="hero-index">The pie collection / Seoul</span>
        </div>
        <div className="hero-side">
          <Image
            src={photo("ts-menu-banana")}
            alt="캐러멜빛 바나나를 올린 바나나 크림 파이"
            fill
            priority
            sizes="35vw"
          />
          <Link href="/pies/banana-cream" className="hero-side-label">
            <span>
              Meet the signature.
              <br />
              <strong>Banana cream pie</strong>
            </span>
            <ArrowUpRight size={25} />
          </Link>
          <span className="round-seal">
            Baked for
            <br />
            <i>good</i>
            <br />
            times.
          </span>
        </div>
      </section>
      <div className="intro-strip">
        <span>Good pie. Good company.</span>
        <p>파이 한 조각이면 충분한 순간들.</p>
        <a href="#collection" aria-label="파이 컬렉션으로 이동">
          <ArrowDown size={20} />
        </a>
      </div>
      <section className="collection section-wrap" id="collection">
        <div className="section-heading">
          <h2>Find your favorite.</h2>
          <p>매일 떠올리고 싶은, 나만의 한 조각.</p>
        </div>
        <Catalog compact />
      </section>
      <section className="editorial">
        <div className="editorial-photo">
          <Image
            src={photo("ts043")}
            alt="테이블 위에 펼쳐진 다양한 따우전드 파이"
            fill
            sizes="(max-width: 700px) 100vw, 55vw"
          />
          <span className="photo-note">A table worth gathering around.</span>
        </div>
        <div className="editorial-copy">
          <span className="small-note">From our table to yours</span>
          <h2>
            Made to
            <br />
            be shared.
          </h2>
          <p>
            좋아하는 사람들과 마주 앉아
            <br />
            서로 다른 취향을 한 테이블에.
            <br />
            우리의 좋은 시간에는 언제나 파이가 있습니다.
          </p>
          <Link href="/shop" className="underlined">
            당신의 파이를 찾아보세요 <ArrowUpRight size={18} />
          </Link>
          <div className="editorial-sign">With love, Thousand.</div>
        </div>
      </section>
      <section className="store-teaser section-wrap">
        <div className="section-heading">
          <h2>
            Come for the pie.
            <br />
            Stay for a while.
          </h2>
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
            <h3>Your kind of place.</h3>
            <span>
              군자 · 신사 · 성수 <ArrowUpRight size={23} />
            </span>
          </div>
        </Link>
      </section>
      <section className="journal section-wrap">
        <div className="section-heading">
          <h2>Beyond the pie.</h2>
          <Link className="underlined" href="/story">
            우리의 이야기 <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="journal-grid">
          <Link href="/story#journey" className="journal-card">
            <div className="journal-image">
              <Image
                src={photo("ts006")}
                alt="따우전드 파이 박스를 들고 있는 손님들"
                fill
                sizes="(max-width: 700px) 100vw, 50vw"
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
                sizes="(max-width: 700px) 100vw, 50vw"
              />
            </div>
            <p>Collaborations</p>
            <h3>
              Two American classics. One sweet story. <ArrowUpRight size={20} />
            </h3>
          </a>
        </div>
      </section>
    </main>
  );
}
