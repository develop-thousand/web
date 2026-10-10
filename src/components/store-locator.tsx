"use client";
import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, MapPin, Clock } from "lucide-react";
import { stores, photo } from "@/lib/catalog";

export function StoreLocator() {
  const [region, setRegion] = useState("서울");
  const [selected, setSelected] = useState(stores[0]);
  const [mapOpen, setMapOpen] = useState(false);
  return (
    <>
      <div
        className="store-filters filter-tabs"
        role="group"
        aria-label="지역 선택"
      >
        {["서울", "해외 팝업"].map((r) => (
          <button
            key={r}
            aria-pressed={r === region}
            onClick={() => setRegion(r)}
          >
            {r}
          </button>
        ))}
      </div>
      {region === "서울" ? (
        <div className="locator">
          <div className="store-list">
            {stores.map((store) => (
              <button
                key={store.id}
                className={`store-choice ${store.id === selected.id ? "selected" : ""}`}
                aria-pressed={store.id === selected.id}
                onClick={() => {
                  setSelected(store);
                  setMapOpen(false);
                }}
              >
                <div>
                  <span>{store.label}</span>
                  <h2>
                    {store.english} <small>{store.name}</small>
                  </h2>
                  <p>{store.address}</p>
                  <p>{store.hours}</p>
                </div>
                <ArrowUpRight size={25} />
              </button>
            ))}
            <p className="muted store-hours-note">
              공개 안내 기준 영업시간입니다. 임시 휴무와 라스트오더는 방문 전
              매장에 확인해 주세요.
            </p>
          </div>
          <div className="selected-store">
            <div className="selected-store-image">
              {mapOpen ? (
                <iframe
                  title={`${selected.name}점 지도`}
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(selected.address + " 따우전드")}&output=embed`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              ) : (
                <Image
                  src={photo(selected.image)}
                  alt={`따우전드 ${selected.name}점`}
                  fill
                  sizes="(max-width: 800px) 100vw, 55vw"
                  priority
                />
              )}
            </div>
            <div className="store-actions">
              <div>
                <p>
                  <MapPin size={16} />
                  {selected.address}
                </p>
                <p>
                  <Clock size={16} />
                  {selected.hours}
                </p>
              </div>
              <div>
                <button
                  className="underlined"
                  onClick={() => setMapOpen((v) => !v)}
                >
                  {mapOpen ? "매장 사진" : "지도 보기"}
                </button>
                <a
                  className="button dark"
                  href={selected.map}
                  target="_blank"
                  rel="noreferrer"
                >
                  길찾기 <ArrowUpRight size={17} />
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="popup-archive">
          <div className="popup-photo">
            <Image
              src={photo("ts043")}
              alt="따우전드 파이 컬렉션 자료 사진"
              fill
              sizes="(max-width: 800px) 100vw, 50vw"
            />
          </div>
          <div>
            <span className="archive-label">
              종료된 팝업 · 2026.09.23–10.04
            </span>
            <h2>
              Aloha,
              <br />
              Hawaii.
            </h2>
            <p>
              DOMODOMO × THOUSAND
              <br />
              Ewa Beach Country Club, Hawaii
            </p>
            <p>
              서울의 파이가 하와이를 만났던 시간.
              <br />
              함께해 주신 모든 분들께 감사드립니다.
            </p>
            <a
              className="underlined"
              href="https://www.instagram.com/p/DeJBC8qgbHv/"
              target="_blank"
              rel="noreferrer"
            >
              팝업 이야기 보기 <ArrowUpRight size={17} />
            </a>
            <p className="muted">
              하와이 상설 매장은 확인되지 않았습니다.
              <br />
              사진은 브랜드 파이 자료 사진입니다.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
