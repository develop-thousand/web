import type { Metadata } from "next";
import { Checkout } from "@/components/checkout";
export const metadata: Metadata = { title: "픽업 주문 체험" };
export default function CheckoutPage() {
  return (
    <main id="main" className="section-wrap checkout-page">
      <Checkout />
    </main>
  );
}
