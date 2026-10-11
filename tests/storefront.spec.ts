import { test, expect } from "@playwright/test";

test("home images, navigation, and responsive layout", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "THE PIE ROOM" })).toHaveCount(
    1,
  );
  const cabinet = await page.locator(".asset-cabinet").boundingBox();
  const viewport = page.viewportSize()!;
  expect(cabinet?.x).toBe(0);
  expect(cabinet?.y).toBe(0);
  expect(cabinet?.width).toBe(viewport.width);
  expect(cabinet?.height).toBe(viewport.height);
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  await expect
    .poll(() =>
      page
        .locator(".empty-cabinet")
        .first()
        .evaluate(
          (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
        ),
    )
    .toBeTruthy();
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
  await page.screenshot({
    path: `artifacts/preview-${testInfo.project.name}.png`,
  });
  await page.screenshot({
    path: `artifacts/home-${testInfo.project.name}.png`,
    fullPage: true,
  });
  expect(errors).toEqual([]);
});

test("cutout showcase, hover persistence, keyboard, cart and reduced motion", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  await expect(
    page.locator(".cabinet-bay:not([inert]) .shelf-product"),
  ).toHaveCount(4);
  await expect(page.getByRole("button", { name: /모션/ })).toHaveCount(0);
  if (testInfo.project.name === "desktop") {
    await page.getByRole("button", { name: "치즈 블루베리 파이 선택" }).hover();
    await expect(page.locator(".asset-cabinet")).toHaveClass(/is-exploring/);
    await expect(page.locator(".shelf-product").first()).toHaveCSS(
      "opacity",
      "0",
    );
    await page.screenshot({ path: "artifacts/atelier-hover.png" });
    await page.locator(".selection-actions").hover();
    await expect(page.locator(".selection-actions a")).toHaveAttribute(
      "href",
      "/pies/blueberry",
    );
  }
  await page.getByRole("button", { name: "피칸 파이 선택" }).click();
  await expect(page.locator(".selection-actions a")).toHaveAttribute(
    "href",
    "/pies/pecan",
  );
  await expect(page.locator(".selection-copy h2")).toHaveText("피칸 파이");
  await page.screenshot({
    path: `artifacts/showcase-selected-${testInfo.project.name}.png`,
  });
  await page.getByRole("button", { name: "선택한 피칸 파이 담기" }).click();
  await expect(page.locator(".bag-line h3")).toHaveText("피칸 파이");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page.getByRole("button", { name: "피칸 파이 선택" }).focus();
  await expect(
    page.getByRole("button", { name: "피칸 파이 선택" }),
  ).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator(".selection-actions a")).toHaveAttribute(
    "href",
    "/pies/figrey",
  );
  await page.getByRole("button", { name: "스트로베리 파이 선택" }).click();
  await expect(
    page.getByRole("button", { name: "선택한 스트로베리 파이 담기" }),
  ).toBeDisabled();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".pie-object").first()).toHaveCSS(
    "transition-duration",
    "0s",
  );
});

test("independent shelf paging, filters and swipe", async ({ page }, info) => {
  await page.goto("/");
  const top = page.locator(".lane-0"),
    bottom = page.locator(".lane-1");
  const background = page.locator(".empty-cabinet");
  await expect(background).toHaveCount(1);
  const before = await background.boundingBox();
  const lowerTransform = await bottom
    .locator(".cabinet-track")
    .getAttribute("style");
  const upperBox = (await top.boundingBox())!;
  await page.mouse.move(15, upperBox.y + upperBox.height / 2);
  await page.mouse.wheel(0, 700);
  await expect(top.locator(".shelf-paging span")).toHaveText("2 / 2");
  await expect(bottom.locator(".shelf-paging span")).toHaveText("1 / 2");
  expect(await bottom.locator(".cabinet-track").getAttribute("style")).toBe(
    lowerTransform,
  );
  expect(await background.boundingBox()).toEqual(before);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  const upperTransform = await top
    .locator(".cabinet-track")
    .getAttribute("style");
  if (info.project.name === "mobile") {
    const box = (await bottom.boundingBox())!;
    const y = box.y + box.height / 2;
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: 330, y }],
    });
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: 60, y }],
    });
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
  } else {
    await bottom.locator(".shelf-paging button").last().click();
  }
  await expect(bottom.locator(".shelf-paging span")).toHaveText("2 / 2");
  expect(await top.locator(".cabinet-track").getAttribute("style")).toBe(
    upperTransform,
  );
  await top.locator(".shelf-paging button").first().click();
  await expect(top.locator(".shelf-paging span")).toHaveText("1 / 2");
  await expect(bottom.locator(".shelf-paging span")).toHaveText("2 / 2");
  await page.locator(".cabinet-filters button").last().click();
  await expect(page.locator(".shelf-paging")).toHaveCount(0);
  await expect(
    page.locator(".cabinet-bay:not([inert]) .shelf-product"),
  ).toHaveCount(2);
  await page.locator(".cabinet-filters button").first().click();
  await expect(page.locator(".shelf-paging span")).toHaveText([
    "1 / 2",
    "1 / 2",
  ]);
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
  await page.screenshot({
    path: `artifacts/product-${testInfo.project.name}.png`,
    fullPage: true,
  });
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
  await page.screenshot({
    path: `artifacts/checkout-${testInfo.project.name}.png`,
    fullPage: true,
  });
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
