export type Pie = {
  slug: string;
  name: string;
  english: string;
  price: number;
  image: string;
  category: "클래식" | "크림" | "시즌";
  note: string;
  description: string;
  available: boolean;
  tag?: string;
};

export const pies: Pie[] = [
  {
    slug: "banana-cream",
    name: "바나나 크림 파이",
    english: "Banana cream pie",
    price: 7500,
    image: "ts-menu-banana",
    category: "크림",
    note: "바나나 · 바닐라 커스터드",
    description:
      "바나나의 달콤함과 바닐라 커스터드, 바삭한 파이지가 만나는 따우전드의 시그니처. 커피 한 잔과 함께 천천히 즐겨보세요.",
    available: true,
    tag: "Signature",
  },
  {
    slug: "blueberry",
    name: "치즈 블루베리 파이",
    english: "Cheese blueberry pie",
    price: 7800,
    image: "ts-menu-blueberry",
    category: "크림",
    note: "블루베리 · 치즈 · 크림",
    description:
      "짙은 블루베리와 부드러운 치즈의 만남. 한 조각의 단면에 담긴 서로 다른 질감과 풍미를 즐겨보세요.",
    available: true,
  },
  {
    slug: "pumpkin",
    name: "펌킨 파이",
    english: "Pumpkin pie",
    price: 7500,
    image: "ts-menu-pumpkin",
    category: "클래식",
    note: "단호박 · 크림",
    description:
      "포근한 단호박의 풍미 위에 부드러운 크림을 올렸습니다. 오랫동안 사랑받는 아메리칸 클래식의 따뜻한 한 조각.",
    available: true,
    tag: "House favorite",
  },
  {
    slug: "pecan",
    name: "피칸 파이",
    english: "Pecan pie",
    price: 7800,
    image: "ts-menu-pecan",
    category: "클래식",
    note: "피칸 · 고소한 풍미",
    description:
      "노릇하게 구운 피칸의 깊은 풍미와 바삭한 파이지. 따뜻한 커피와 함께하면 더 좋은, 고소하고 달콤한 시간.",
    available: true,
  },
  {
    slug: "apple",
    name: "애플 파이",
    english: "Apple pie",
    price: 8500,
    image: "ts-menu-apple",
    category: "클래식",
    note: "사과 · 시나몬",
    description:
      "사과와 시나몬이 전하는 익숙한 행복. 사진 속 아이스크림은 연출 이미지이며 실제 제공 구성은 매장 확인이 필요합니다.",
    available: true,
  },
  {
    slug: "mud",
    name: "머드 파이",
    english: "Chocolate mud pie",
    price: 8000,
    image: "ts-menu-mud",
    category: "크림",
    note: "초콜릿 · 크림",
    description:
      "초콜릿의 진한 풍미를 부드러운 크림과 함께. 포크를 넣는 순간부터 기분 좋은 초콜릿의 여운이 이어집니다.",
    available: true,
  },
  {
    slug: "figrey",
    name: "피그레이 파이",
    english: "Fig & Earl Grey pie",
    price: 8500,
    image: "ts-menu-fig",
    category: "시즌",
    note: "무화과 · 얼그레이",
    description:
      "무화과의 달콤함에 얼그레이의 은은한 향을 더한 계절의 한 조각. 시즌 제품의 실제 판매 기간은 매장에서 확인해 주세요.",
    available: true,
    tag: "Seasonal",
  },
  {
    slug: "strawberry",
    name: "스트로베리 파이",
    english: "Strawberry pie",
    price: 8500,
    image: "ts-menu-strawberry",
    category: "시즌",
    note: "딸기 · 크림",
    description:
      "붉게 익은 딸기와 부드러운 크림. 다시 돌아올 딸기의 계절을 기다리며 지난 컬렉션을 만나보세요.",
    available: false,
    tag: "Season archive",
  },
];

export const money = (amount: number) =>
  new Intl.NumberFormat("ko-KR").format(amount) + "원";
export const photo = (name: string) => `/images/${name}.jpg`;

export const stores = [
  {
    id: "gunja",
    name: "군자",
    english: "Gunja",
    label: "Where it all began",
    address: "서울 광진구 긴고랑로12길 59",
    hours: "매일 12:00–22:00",
    image: "ts004",
    map: "https://maps.app.goo.gl/1Hv8ojk2miDPZb7Z6?g_st=ic",
  },
  {
    id: "sinsa",
    name: "신사",
    english: "Sinsa",
    label: "A little stop in the city",
    address: "서울 강남구 강남대로162길 36 1층",
    hours: "매일 12:00–22:00",
    image: "ts-sinsa-2",
    map: "https://maps.app.goo.gl/QAV16Dk8ofgjsmRL8?g_st=ic",
  },
  {
    id: "seongsu",
    name: "성수",
    english: "Seongsu",
    label: "Your neighborhood pie house",
    address: "서울 성동구 연무장1길 7",
    hours: "매일 12:00–22:00",
    image: "ts-seongsoo-7",
    map: "https://maps.app.goo.gl/qkGT1Hn3atMoqBkh7?g_st=ic",
  },
];
