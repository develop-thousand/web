import { test, expect } from "@playwright/test";

test("home images, navigation, and responsive layout", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "A little slice. A whole feeling." }),
  ).toBeVisible();
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  await expect
    .poll(() =>
      page
        .locator(".hero-main img")
        .evaluate(
          (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
        ),
    )
    .toBeTruthy();
  for (const section of [
    ".collection",
    ".editorial",
    ".store-teaser",
    ".journal",
  ])
    await page.locator(section).scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      page
        .locator("main img")
        .evaluateAll((images: HTMLImageElement[]) =>
          images
            .filter((img) => img.getBoundingClientRect().width > 0)
            .every((img) => img.complete && img.naturalWidth > 0),
        ),
    )
    .toBeTruthy();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(overflow).toBe(false);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.screenshot({ path: `artifacts/preview-${testInfo.project.name}.png` });
  await page.screenshot({
    path: `artifacts/home-${testInfo.project.name}.png`,
    fullPage: true,
  });
  expect(errors).toEqual([]);
});

test("filter, search, persisted cart and demo pickup flow", async ({
  page,
}, testInfo) => {
  await page.goto("/shop");
  await page.getByRole("button", { name: "시즌", exact: true }).click();
  await expect(page.locator(".pie-card")).toHaveCount(2);
  await expect(
    page.getByRole("button", { name: "스트로베리 파이 장바구니 담기" }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "검색 열기" }).click();
  await page.getByRole("textbox", { name: "파이 검색" }).fill("없는메뉴");
  await expect(page.getByText("검색 결과가 없어요.")).toBeVisible();
  await page.getByRole("textbox", { name: "파이 검색" }).fill("banana");
  await expect(page.locator(".search-result")).toHaveCount(1);
  await page.locator(".search-result").click();
  await expect(page).toHaveURL(/pies\/banana-cream/);
  await page.locator(".detail-image img").waitFor();
  await page.screenshot({ path: `artifacts/product-${testInfo.project.name}.png`, fullPage: true });
  await page.getByRole("button", { name: "수량 늘리기", exact: true }).click();
  await page.getByRole("button", { name: "장바구니 담기 · 15,000원" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.locator(".drawer-bottom .total")).toContainText("15,000원");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "장바구니 열기 2개" }).click();
  await page
    .getByRole("button", { name: "바나나 크림 파이 수량 줄이기" })
    .click();
  await expect(page.locator(".drawer-bottom .total")).toContainText("7,500원");
  await page.getByRole("link", { name: "픽업 주문 체험" }).click();
  await expect(page).toHaveURL(/checkout/);
  await page.screenshot({ path: `artifacts/checkout-${testInfo.project.name}.png`, fullPage: true });
  await page.getByRole("radio", { name: /성수점/ }).check();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const date = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, "0")}-${String(tomorrow.getDate()).padStart(2, "0")}`;
  await page.getByLabel("픽업 날짜").fill(date);
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "데모 주문 완료하기" }).click();
  await expect(
    page.getByRole("heading", { name: "주문 체험이 완료되었습니다." }),
  ).toBeVisible();
  await expect(
    page.getByText("실제 결제·매장 예약은 이루어지지 않았습니다."),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "장바구니 열기 0개" }),
  ).toBeVisible();
});

test("stores distinguish local shops and archived Hawaii pop-up", async ({
  page,
}, testInfo) => {
  await page.goto("/stores");
  await expect(page.locator(".store-choice")).toHaveCount(3);
  await page.getByRole("button", { name: /Seongsu 성수/ }).click();
  await expect(page.locator(".store-actions")).toContainText(
    "서울 성동구 연무장1길 7",
  );
  await expect(page.getByRole("link", { name: "길찾기" })).toHaveAttribute(
    "href",
    /qkGT1Hn3atMoqBkh7/,
  );
  await page.getByRole("button", { name: "지도 보기" }).click();
  await expect(page.locator("iframe")).toHaveAttribute("title", "성수점 지도");
  await page.getByRole("button", { name: "매장 사진", exact: true }).click();
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.screenshot({
    path: `artifacts/stores-${testInfo.project.name}.png`,
    fullPage: true,
  });
  await page.getByRole("button", { name: "해외 팝업" }).click();
  await expect(page.getByText("종료된 팝업 · 2026.09.23–10.04")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "팝업 이야기 보기" }),
  ).toHaveAttribute("href", "https://www.instagram.com/p/DeJBC8qgbHv/");
});

test("invalid persisted data recovers and unknown products return 404", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      "thousand-bag-v1",
      JSON.stringify([
        { slug: "unknown", quantity: 1 },
        { slug: "banana-cream", quantity: -2 },
        { slug: "strawberry", quantity: 1 },
      ]),
    ),
  );
  await page.goto("/checkout");
  await expect(
    page.getByRole("heading", { name: "먼저, 좋아하는 파이부터." }),
  ).toBeVisible();
  const response = await page.goto("/pies/not-a-real-pie");
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "이 조각은 찾을 수 없어요." }),
  ).toBeVisible();
});
