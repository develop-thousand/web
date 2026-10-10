import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pies } from "@/lib/catalog";
import { PieDetail } from "@/components/pie-detail";
import { PieCard } from "@/components/catalog";
export function generateStaticParams() {
  return pies.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = pies.find((p) => p.slug === slug);
  return { title: p?.name || "파이를 찾을 수 없습니다" };
}
export default async function DetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pie = pies.find((p) => p.slug === slug);
  if (!pie) notFound();
  return (
    <main id="main">
      <PieDetail pie={pie} />
      <section className="section-wrap related">
        <div className="section-heading">
          <h2>Make it a table.</h2>
          <p>함께 나누면 더 좋은 파이.</p>
        </div>
        <div className="product-grid">
          {pies
            .filter((p) => p.slug !== slug)
            .slice(0, 4)
            .map((p) => (
              <PieCard key={p.slug} pie={p} />
            ))}
        </div>
      </section>
    </main>
  );
}
