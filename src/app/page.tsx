import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Catalog } from "@/components/catalog";
import { PieShowcase } from "@/components/pie-showcase";
import { photo } from "@/lib/catalog";

export default function Home() {
  return (
    <main id="main" className="atelier-home">
      <PieShowcase />
      <section className="collection section-wrap" id="collection">
        <div className="collection-heading">
          <h2>FIND YOUR FAVORITE</h2>
          <p>클래식부터 계절의 한 조각까지.</p>
        </div>
        <Catalog compact />
      </section>
      <section className="editorial atelier-story">
        <div className="atelier-story-photo">
          <Image
            src={photo("ts006")}
            alt="따우전드 파이 박스를 들고 함께 웃는 손님들"
            fill
            sizes="(max-width:700px) 90vw, 45vw"
          />
        </div>
        <div>
          <h2>
            GOOD PIE.
            <br />
            GOOD COMPANY.
          </h2>
          <p>
            파이가 있는 테이블에는 이야기가 모입니다.
            <br />
            서울에서 시작된 따우전드의 달콤한 일상.
          </p>
          <Link href="/story">
            따우전드 이야기 <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>
      <section className="store-teaser section-wrap">
        <div className="store-heading">
          <h2>COME ON IN</h2>
          <p>군자 · 신사 · 성수</p>
        </div>
        <Link href="/stores" className="atelier-store-image">
          <Image
            src={photo("ts-seongsoo-7")}
            alt="목재와 스테인드글라스로 꾸며진 따우전드 성수 매장"
            fill
            sizes="92vw"
          />
          <span>
            가까운 매장 찾기 <ArrowUpRight size={18} />
          </span>
        </Link>
      </section>
      <section className="journal section-wrap">
        <div className="section-heading">
          <h2>BEYOND THE COUNTER</h2>
          <Link href="/story" className="underlined">
            브랜드 아카이브 <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="journal-grid">
          <Link href="/story#journey" className="journal-card">
            <div className="journal-image">
              <Image
                src={photo("ts-members")}
                alt="따우전드 팀"
                fill
                sizes="(max-width:700px) 90vw, 45vw"
              />
            </div>
            <p>People of THOUSAND</p>
            <h3>
              한 조각을 만드는 사람들 <ArrowUpRight size={17} />
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
                sizes="(max-width:700px) 90vw, 45vw"
              />
            </div>
            <p>THOUSAND × FRUIT OF THE LOOM</p>
            <h3>
              취향이 만나는 순간 <ArrowUpRight size={17} />
            </h3>
          </a>
        </div>
      </section>
    </main>
  );
}
