import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { photo } from "@/lib/catalog";
export const metadata: Metadata = { title: "우리의 이야기" };
export default function Story() {
  return (
    <main id="main">
      <section className="story-hero">
        <Image
          src={photo("ts-members")}
          alt="따우전드 매장에 모인 팀원들"
          fill
          priority
          sizes="100vw"
        />
        <div className="hero-shade" />
        <div>
          <span>A pie house from Seoul</span>
          <h1>
            Small beginnings.
            <br />
            Sweet possibilities.
          </h1>
        </div>
      </section>
      <section className="story-intro section-wrap">
        <span>Our story, since 2022</span>
        <h2>
          좋은 파이 한 조각이
          <br />
          만드는 작은 행복.
        </h2>
        <p>
          2022년, 군자의 작은 가게에서 시작된 따우전드.
          <br />
          우리는 아메리칸 클래식을 서울의 감각으로 다시 해석합니다.
          <br />
          <br />
          매장에 들어서는 순간부터 마지막 한 입까지.
          <br />
          익숙한 맛과 새로운 기분이 함께하는 곳.
          <br />
          그렇게 우리의 테이블은 조금씩 넓어지고 있습니다.
        </p>
        <Link className="underlined" href="/shop">
          파이 컬렉션 보기 <ArrowUpRight size={18} />
        </Link>
      </section>
      <section className="journey section-wrap" id="journey">
        <div className="section-heading">
          <h2>One slice at a time.</h2>
          <p>사람과 도시를 잇는 우리의 여정.</p>
        </div>
        <div className="journey-grid">
          <div>
            <Image
              src={photo("ts004")}
              alt="따우전드 군자 매장 앞에 모인 손님들"
              width={1080}
              height={810}
            />
            <h3>It started in Gunja.</h3>
            <p>
              군자에서 시작해 신사와 성수까지.
              <br />
              서로 다른 동네에서 같은 마음으로 만납니다.
            </p>
            <Link className="underlined" href="/stores">
              서울 매장 찾기 <ArrowUpRight size={16} />
            </Link>
          </div>
          <div>
            <Image
              src={photo("ts024")}
              alt="따우전드 파이 박스를 들고 있는 가족"
              width={1080}
              height={1350}
            />
            <h3>Good pie travels.</h3>
            <p>
              2026년 9월 23일부터 10월 4일까지,
              <br />
              하와이에서 함께 나눈 특별한 파이 타임.
            </p>
            <a
              className="underlined"
              href="https://www.instagram.com/p/DeJBC8qgbHv/"
              target="_blank"
              rel="noreferrer"
            >
              하와이 팝업 기록 <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
