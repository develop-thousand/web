import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="empty-state not-found">
      <p>404 / A missing slice</p>
      <h1>이 조각은 찾을 수 없어요.</h1>
      <p>다른 파이를 만나러 가볼까요?</p>
      <Link className="button dark" href="/shop">
        파이 컬렉션으로
      </Link>
    </main>
  );
}
