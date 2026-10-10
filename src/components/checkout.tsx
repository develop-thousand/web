"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Check } from "lucide-react";
import { useShop } from "./shop-provider";
import { pies, stores, money, photo } from "@/lib/catalog";

function localDate(offset = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function Checkout() {
  const { cart, ready, clear } = useShop();
  const [store, setStore] = useState("gunja");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("12:00");
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState<{
    store: string;
    date: string;
    time: string;
    total: number;
  } | null>(null);
  const total = cart.reduce(
    (sum, row) =>
      sum + pies.find((p) => p.slug === row.slug)!.price * row.quantity,
    0,
  );
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!cart.length || date < localDate(1) || date > localDate(14)) {
      setError("내일부터 14일 이내의 날짜를 선택해 주세요.");
      return;
    }
    setCompleted({
      store: stores.find((s) => s.id === store)!.name,
      date,
      time,
      total,
    });
    clear();
  }
  if (!ready)
    return (
      <p className="empty-state" role="status">
        장바구니를 불러오고 있어요.
      </p>
    );
  if (completed)
    return (
      <section className="checkout-success" role="status">
        <span className="success-icon">
          <Check size={35} />
        </span>
        <h1>
          A little happiness,
          <br />
          in a box.
        </h1>
        <h2>주문 체험이 완료되었습니다.</h2>
        <p>
          실제 결제·매장 예약은 이루어지지 않았습니다.
          <br />
          방문 예약은 매장에 직접 문의해 주세요.
        </p>
        <dl>
          <div>
            <dt>선택한 매장</dt>
            <dd>{completed.store}점</dd>
          </div>
          <div>
            <dt>선택한 시간</dt>
            <dd>
              {completed.date} {completed.time}
            </dd>
          </div>
          <div>
            <dt>샘플 주문 금액</dt>
            <dd>{money(completed.total)}</dd>
          </div>
        </dl>
        <Link href="/stores" className="button dark">
          매장 확인하기 <ArrowUpRight size={17} />
        </Link>
        <Link href="/shop" className="underlined">
          파이 더 둘러보기
        </Link>
      </section>
    );
  if (!cart.length)
    return (
      <section className="empty-state">
        <h1>먼저, 좋아하는 파이부터.</h1>
        <p>장바구니에 파이를 담아 주문을 체험해 보세요.</p>
        <Link href="/shop" className="button dark">
          파이 보러 가기 <ArrowUpRight size={17} />
        </Link>
      </section>
    );
  return (
    <>
      <div className="page-heading">
        <span>Your pie, your time</span>
        <h1>
          Pick up
          <br />a little happiness.
        </h1>
      </div>
      <div className="demo-notice">
        주문 체험 화면입니다. 실제 결제나 예약이 발생하지 않으며 개인정보를
        수집하지 않습니다.
      </div>
      <form className="checkout-grid" onSubmit={submit}>
        <div className="checkout-form">
          <h2>픽업 장소와 시간</h2>
          <fieldset>
            <legend>매장 선택</legend>
            {stores.map((s) => (
              <label className="radio-store" key={s.id}>
                <input
                  type="radio"
                  name="store"
                  value={s.id}
                  checked={store === s.id}
                  onChange={() => setStore(s.id)}
                />
                <span>
                  <strong>{s.name}점</strong>
                  <small>{s.address}</small>
                </span>
              </label>
            ))}
          </fieldset>
          <div className="checkout-fields">
            <label>
              픽업 날짜
              <input
                type="date"
                required
                min={localDate(1)}
                max={localDate(14)}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>
            <label>
              픽업 시간
              <select value={time} onChange={(e) => setTime(e.target.value)}>
                {[
                  "12:00",
                  "13:00",
                  "14:00",
                  "15:00",
                  "16:00",
                  "17:00",
                  "18:00",
                  "19:00",
                  "20:00",
                ].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
          </div>
          <p className="muted">
            날짜와 시간은 체험용입니다. 실제 매장 예약 가능 시간을 의미하지
            않습니다. 배송 주문은 준비 중입니다.
          </p>
          <label className="consent">
            <input type="checkbox" required />
            실제 주문이 아닌 체험임을 확인했습니다.
          </label>
          {error && (
            <p role="alert" className="form-error">
              {error}
            </p>
          )}
        </div>
        <div className="order-summary">
          <h2>당신의 파이 박스</h2>
          {cart.map((row) => {
            const p = pies.find((p) => p.slug === row.slug)!;
            return (
              <div className="summary-line" key={p.slug}>
                <Image
                  src={photo(p.image)}
                  alt={p.name}
                  width={72}
                  height={88}
                />
                <div>
                  <strong>{p.name}</strong>
                  <span>조각 × {row.quantity}</span>
                </div>
                <span>{money(p.price * row.quantity)}</span>
              </div>
            );
          })}
          <div className="total">
            <span>상품 합계</span>
            <strong>{money(total)}</strong>
          </div>
          <div className="summary-pickup">
            <span>수령 방법</span>
            <span>매장 픽업</span>
          </div>
          <button className="button dark full" type="submit">
            데모 주문 완료하기 <ArrowUpRight size={18} />
          </button>
          <p className="muted">결제 금액은 청구되지 않습니다.</p>
        </div>
      </form>
    </>
  );
}
