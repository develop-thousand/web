"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, ArrowUpRight } from "lucide-react";
import { useShop } from "./shop-provider";

export function Header() {
  const { count, openCart, openSearch } = useShop();
  const path = usePathname();
  return (
    <>
      <a href="#main" className="skip-link">
        본문으로 건너뛰기
      </a>
      <div className="announcement">
        서울에서 시작된 아메리칸 파이 하우스{" "}
        <span>Fresh perspectives. Classic pies.</span>
      </div>
      <header className="header">
        <nav aria-label="메인 메뉴" className="nav-left">
          <Link
            href="/shop"
            aria-current={path === "/shop" ? "page" : undefined}
          >
            Shop
          </Link>
          <Link
            href="/stores"
            aria-current={path === "/stores" ? "page" : undefined}
          >
            Stores
          </Link>
          <Link
            href="/story"
            aria-current={path === "/story" ? "page" : undefined}
          >
            Our story
          </Link>
        </nav>
        <Link href="/" aria-label="따우전드 홈" className="wordmark">
          THOUSAND
        </Link>
        <div className="nav-right">
          <span className="locale">Seoul, Korea</span>
          <button
            onClick={openSearch}
            className="icon-button"
            aria-label="검색 열기"
          >
            <Search size={20} />
          </button>
          <button
            className="bag-button"
            onClick={openCart}
            aria-label={`장바구니 열기 ${count}개`}
          >
            <ShoppingBag size={19} />
            <span>Bag ({count})</span>
          </button>
        </div>
      </header>
    </>
  );
}

export function Footer() {
  const path = usePathname();
  if (path === "/") return null;
  return (
    <footer className="footer">
      <div className="footer-top">
        <div>
          <p className="footer-title">
            There’s always
            <br />
            room for pie.
          </p>
          <p>한 조각의 파이, 함께 나누는 좋은 시간.</p>
        </div>
        <div>
          <h3>Come on in.</h3>
          <Link href="/shop">파이 쇼핑하기</Link>
          <Link href="/stores">가까운 매장 찾기</Link>
          <Link href="/story">따우전드 이야기</Link>
        </div>
        <div>
          <h3>Say hello.</h3>
          <a
            href="https://www.instagram.com/thousand_official_/"
            target="_blank"
            rel="noreferrer"
          >
            Instagram <ArrowUpRight size={15} />
          </a>
          <a
            href="https://www.instagram.com/thousand_official_/"
            target="_blank"
            rel="noreferrer"
          >
            협업 문의 <ArrowUpRight size={15} />
          </a>
          <span>Gunja · Sinsa · Seongsu</span>
        </div>
      </div>
      <div className="footer-wordmark" aria-hidden="true">
        THOUSAND
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} THOUSAND — Design concept</span>
        <span>
          본 사이트는 구매 경험 시연용이며 실제 주문·결제를 받지 않습니다.
        </span>
        <a href="#main">맨 위로 ↑</a>
      </div>
    </footer>
  );
}
