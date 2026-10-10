import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Catalog } from "@/components/catalog";
import { PieStudio } from "@/components/pie-studio";
import { photo } from "@/lib/catalog";

export default function Home() {
  return (
    <main id="main" className="unboxed-home">
      <PieStudio />
      <div className="brand-tape" aria-hidden="true">
        <span>NOT JUST A PIE.</span>
        <span>IT’S YOUR KIND OF PIE.</span>
        <span>NOT JUST A PIE.</span>
      </div>
      <section className="collection section-wrap" id="collection">
        <div className="collection-title">
          <h2>
            GOOD TASTE.
            <br />
            <span>YOUR RULES.</span>
          </h2>
          <p>
            당신의 취향에 정답은 없으니까.
            <br />
            클래식부터 계절의 한 조각까지.
          </p>
        </div>
        <Catalog compact />
      </section>
      <section className="editorial pie-culture">
        <div className="culture-type">
          <span>Pie is a way of being together.</span>
          <h2>
            BREAK
            <br />
            THE PIE.
            <br />
            <i>
              NOT THE
              <br />
              MOMENT.
            </i>
          </h2>
          <Link href="/story">
            함께 나누는 이야기 <ArrowUpRight size={20} />
          </Link>
        </div>
        <div className="culture-photo">
          <Image
            src={photo("ts043")}
            alt="다양한 크림과 과일을 올린 따우전드 파이 테이블"
            fill
            sizes="(max-width: 700px) 95vw, 58vw"
          />
          <div className="culture-note">
            서로 다른 취향이
            <br />
            하나의 테이블에.
          </div>
        </div>
      </section>
      <section className="store-teaser store-world section-wrap">
        <div className="world-heading">
          <h2>
            OFFLINE,
            <br />
            <i>ON YOUR MIND.</i>
          </h2>
          <p>
            온라인에서 발견한 취향,
            <br />
            따우전드의 공간에서 이어집니다.
          </p>
        </div>
        <div className="world-scene">
          <Link href="/stores" className="store-wide">
            <Image
              src={photo("ts-seongsoo-7")}
              alt="따뜻한 목재와 스테인드글라스가 있는 따우전드 성수 매장"
              fill
              sizes="(max-width:700px) 100vw, 80vw"
            />
            <span className="door-invite">
              COME
              <br />
              ON IN. <ArrowUpRight size={46} />
            </span>
          </Link>
          <div className="store-ticket">
            <span>YOUR NEXT STOP</span>
            <h3>
              THOUSAND
              <br />
              SEOUL.
            </h3>
            <p>군자 · 신사 · 성수</p>
            <Link href="/stores">
              매장 찾기 <ArrowUpRight size={19} />
            </Link>
            <div className="ticket-bars" aria-hidden="true" />
          </div>
        </div>
      </section>
      <section className="journal section-wrap">
        <div className="section-heading">
          <h2>
            OUT OF
            <br />
            THE ORDINARY.
          </h2>
          <Link className="underlined" href="/story">
            브랜드 아카이브 <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="journal-grid">
          <Link href="/story#journey" className="journal-card">
            <div className="journal-image">
              <Image
                src={photo("ts006")}
                alt="따우전드 파이 박스를 든 손님들"
                fill
                sizes="(max-width:700px) 90vw, 55vw"
              />
            </div>
            <p>People, pies & everything in between.</p>
            <h3>
              우리의 파이를 완성하는 사람들. <ArrowUpRight size={20} />
            </h3>
          </Link>
          <a
            className="journal-card"
            href="https://www.instagram.com/fruitoftheloom.kr/reel/DQS4RQzkyIS/"
            target="_blank"
            rel="noreferrer"
          >
            <div className="journal-image poster">
              <Image
                src={photo("collabo_fruit_3")}
                alt="프룻오브더룸과 따우전드 협업 포스터"
                fill
                sizes="(max-width:700px) 90vw, 35vw"
              />
            </div>
            <p>THOUSAND × FRUIT OF THE LOOM</p>
            <h3>
              다른 세계가 만나는 방식. <ArrowUpRight size={20} />
            </h3>
          </a>
        </div>
      </section>
    </main>
  );
}
