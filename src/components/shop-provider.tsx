"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, X, ArrowUpRight, Search } from "lucide-react";
import { pies, money, photo } from "@/lib/catalog";

type Line = { slug: string; quantity: number };
type ShopContext = {
  cart: Line[];
  count: number;
  ready: boolean;
  add: (slug: string, quantity?: number) => void;
  update: (slug: string, quantity: number) => void;
  clear: () => void;
  openCart: () => void;
  openSearch: () => void;
};
const Context = createContext<ShopContext | null>(null);
export function useShop() {
  const value = useContext(Context);
  if (!value) throw new Error("ShopProvider is required");
  return value;
}

function readCart(raw: string | null): Line[] {
  try {
    const data: unknown = JSON.parse(raw || "[]");
    if (!Array.isArray(data)) return [];
    const result: Line[] = [];
    for (const row of data) {
      if (
        row &&
        typeof row === "object" &&
        typeof row.slug === "string" &&
        Number.isInteger(row.quantity) &&
        row.quantity > 0 &&
        pies.some((p) => p.slug === row.slug && p.available) &&
        !result.some((p) => p.slug === row.slug)
      )
        result.push({ slug: row.slug, quantity: Math.min(20, row.quantity) });
    }
    return result;
  } catch {
    return [];
  }
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Line[]>([]);
  const [ready, setReady] = useState(false);
  const [panel, setPanel] = useState<"cart" | "search" | null>(null);
  const [query, setQuery] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  useEffect(() => {
    try {
      setCart(readCart(localStorage.getItem("thousand-bag-v1")));
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) {
      try {
        localStorage.setItem("thousand-bag-v1", JSON.stringify(cart));
      } catch {}
    }
  }, [cart, ready]);
  useEffect(() => {
    if (panel) {
      previousFocus.current = document.activeElement as HTMLElement;
      dialog.current?.showModal();
      const overflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = overflow;
        dialog.current?.close();
        previousFocus.current?.focus();
      };
    }
  }, [panel]);
  const add = (slug: string, quantity = 1) => {
    if (!pies.some((p) => p.slug === slug && p.available)) return;
    const safe = Number.isFinite(quantity)
      ? Math.max(1, Math.min(20, Math.floor(quantity)))
      : 1;
    setCart((current) =>
      current.some((p) => p.slug === slug)
        ? current.map((p) =>
            p.slug === slug
              ? { ...p, quantity: Math.min(20, p.quantity + safe) }
              : p,
          )
        : [...current, { slug, quantity: safe }],
    );
    setPanel("cart");
  };
  const update = (slug: string, quantity: number) =>
    setCart((current) =>
      quantity <= 0
        ? current.filter((p) => p.slug !== slug)
        : current.map((p) =>
            p.slug === slug
              ? { ...p, quantity: Math.min(20, Math.floor(quantity)) }
              : p,
          ),
    );
  const count = cart.reduce((sum, row) => sum + row.quantity, 0);
  const total = cart.reduce(
    (sum, row) =>
      sum + pies.find((p) => p.slug === row.slug)!.price * row.quantity,
    0,
  );
  const results = pies.filter((p) =>
    `${p.name} ${p.english} ${p.note}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );
  return (
    <Context.Provider
      value={{
        cart,
        count,
        ready,
        add,
        update,
        clear: () => setCart([]),
        openCart: () => setPanel("cart"),
        openSearch: () => {
          setQuery("");
          setPanel("search");
        },
      }}
    >
      {children}
      <dialog
        ref={dialog}
        className={`drawer ${panel === "search" ? "search-drawer" : ""}`}
        aria-labelledby="drawer-title"
        onCancel={() => setPanel(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            const r = e.currentTarget.getBoundingClientRect();
            if (e.clientX < r.left || e.clientX > r.right) setPanel(null);
          }
        }}
      >
        <div className="drawer-heading">
          <h2 id="drawer-title">
            {panel === "search" ? "Find your pie." : `Your bag (${count})`}
          </h2>
          <button
            className="icon-button"
            aria-label="닫기"
            onClick={() => setPanel(null)}
          >
            <X />
          </button>
        </div>
        {panel === "search" ? (
          <>
            <label className="search-field">
              <Search size={20} />
              <input
                aria-label="파이 검색"
                autoFocus
                placeholder="파이 이름이나 재료를 검색하세요"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            <p className="muted">
              {query
                ? `${results.length}개의 파이를 찾았어요.`
                : "오늘은 어떤 파이가 떠오르나요?"}
            </p>
            <div className="drawer-lines">
              {results.map((p) => (
                <Link
                  className="search-result"
                  href={`/pies/${p.slug}`}
                  key={p.slug}
                  onClick={() => setPanel(null)}
                >
                  <Image
                    src={photo(p.image)}
                    alt={p.name}
                    width={90}
                    height={110}
                  />
                  <div>
                    <h3>{p.name}</h3>
                    <p>{p.note}</p>
                    <span>{money(p.price)}</span>
                  </div>
                  <ArrowUpRight size={20} />
                </Link>
              ))}
              {!results.length && (
                <p className="empty-state">
                  검색 결과가 없어요.
                  <br />
                  ‘바나나’, ‘크림’, ‘초콜릿’으로 다시 찾아보세요.
                </p>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="drawer-lines">
              {!cart.length ? (
                <div className="empty-state">
                  <span className="empty-pie">◔</span>
                  <h3>아직 비어 있는 파이 박스.</h3>
                  <p>마음에 드는 한 조각을 담아보세요.</p>
                  <Link
                    className="button dark"
                    href="/shop"
                    onClick={() => setPanel(null)}
                  >
                    파이 둘러보기 <ArrowUpRight size={17} />
                  </Link>
                </div>
              ) : (
                cart.map((row) => {
                  const p = pies.find((p) => p.slug === row.slug)!;
                  return (
                    <div className="bag-line" key={row.slug}>
                      <Link
                        href={`/pies/${p.slug}`}
                        onClick={() => setPanel(null)}
                      >
                        <Image
                          src={photo(p.image)}
                          alt={p.name}
                          width={110}
                          height={140}
                        />
                      </Link>
                      <div>
                        <h3>{p.name}</h3>
                        <p>조각 / 1개</p>
                        <div className="quantity">
                          <button
                            aria-label={`${p.name} 수량 줄이기`}
                            onClick={() => update(p.slug, row.quantity - 1)}
                          >
                            <Minus size={14} />
                          </button>
                          <span>{row.quantity}</span>
                          <button
                            disabled={row.quantity >= 20}
                            aria-label={`${p.name} 수량 늘리기`}
                            onClick={() => update(p.slug, row.quantity + 1)}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <strong>{money(p.price * row.quantity)}</strong>
                      </div>
                      <button
                        className="icon-button remove"
                        aria-label={`${p.name} 삭제`}
                        onClick={() => update(p.slug, 0)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
            {!!cart.length && (
              <div className="drawer-bottom">
                <div className="total">
                  <span>상품 합계</span>
                  <strong>{money(total)}</strong>
                </div>
                <p className="muted">
                  샘플 가격 기준 · 실제 결제와 예약은 진행되지 않습니다.
                </p>
                <Link
                  href="/checkout"
                  className="button dark full"
                  onClick={() => setPanel(null)}
                >
                  픽업 주문 체험 <ArrowUpRight size={18} />
                </Link>
                <button className="text-button" onClick={() => setPanel(null)}>
                  계속 둘러보기
                </button>
              </div>
            )}
          </>
        )}
      </dialog>
    </Context.Provider>
  );
}
