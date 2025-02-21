"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./aside.module.css";
import "nouislider/dist/nouislider.css";
import noUiSlider from "nouislider";
import FilterGroup from "./filtergroup";
import FilterLinkGroup from "./filterlinkgroup";
import HotSaleGroup from "./hotsalegroup";
import useSWR from "swr";
import { usePathname, useSearchParams } from "next/navigation";

export default function AsideAside({
  changeUrl = () => {},
  keyword = {},
  setKeyword = () => {},
  setPageNow = () => {},
  minPrice = 0,
  maxPrice = 0,
  setMaxPrice = () => {},
  setMinPrice = () => {},
}) {
  // const [minPrice, setMinPrice] = useState(0);
  // const [maxPrice, setMaxPrice] = useState(30000);
  const priceSliderRef = useRef(null);
  const pathname = usePathname();
  const query = useSearchParams();
  // console.log(changeUrl);
  const url = "http://localhost:5000/api/products/categoryName";
  const fetcher = async (url) => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("資料要求失敗");
      return res.json();
    } catch (err) {
      console.error("資料要求失敗:", err);
      throw err;
    }
  };
  const { data, isLoading, error, mutate } = useSWR(url, fetcher);
  const categorys = data?.data;
  const categoryName = [];
  const category = {};
  const categoryClass = [];
  if (categorys) {
    categorys.map((v, i) => {
      if (!categoryName.includes(v.category)) {
        categoryName.push(v.category);
        category[v.category] = [];
      }
      category[v.category].push(v);
    });
  }
  if (category) {
    categoryName.forEach((v, i) => {
      // console.log(category[v]);
      categoryClass[i] = [];
      category[v].map((v) => {
        if (!categoryClass[i].find((e) => e == v.class)) {
          categoryClass[i].push(v.class);
        }
      });
    });
  }
  const i = categoryName.findIndex((v) => v == query.get("category"));
  const handleMinPriceChange = (e) => {
    let value = e.target.value;
    if (value === "") {
      setMinPrice(""); // 清空
      return;
    }

    value = Number(value);
    if (isNaN(value)) return;
    if (value < 0) value = 0;
    if (value > maxPrice) value = maxPrice;

    setMinPrice(value);

    // 滑桿不會影響使用者輸入
    if (priceSliderRef.current?.noUiSlider) {
      priceSliderRef.current.noUiSlider.set([value, maxPrice]);
    }
  };

  const handleMaxPriceChange = (e) => {
    let value = e.target.value;
    if (value === "") {
      setMaxPrice(""); // 清空
      return;
    }

    value = Number(value);
    if (isNaN(value)) return;
    if (value > maxPrice) value = maxPrice;
    if (value < minPrice) value = minPrice;

    setMaxPrice(value);

    if (priceSliderRef.current?.noUiSlider) {
      priceSliderRef.current.noUiSlider.set([minPrice, value]);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!priceSliderRef.current) return;

    // 初始化滑桿
    noUiSlider.create(priceSliderRef.current, {
      start: [minPrice, maxPrice],
      connect: true,
      range: { min: 0, max: maxPrice },
      step: 100,
    });

    // 滑桿更新時同步 `state`
    priceSliderRef.current.noUiSlider.on("change", (values) => {
      setMinPrice(parseFloat(values[0]));
      setMaxPrice(parseFloat(values[1]));
    });

    return () => {
      if (priceSliderRef.current?.noUiSlider) {
        priceSliderRef.current.noUiSlider.destroy();
      }
    };
  }, []);
  useEffect(() => {}, [pathname, query]);

  return (
    <aside className={styles.Sidebar}>
      <div className={styles.SearchTable}>
        <img src="/product/font/search.png" alt="" />
        <input
          type="text"
          placeholder="搜尋商品"
          onKeyUp={(e) => {
            changeUrl(
              `http://localhost:5000/api/products/search?${
                query.get("category")
                  ? `category=${query.get("category")}&`
                  : ""
              }keyword=${e.target.value}`
            );
            setPageNow(1);
          }}
        />
      </div>
      <HotSaleGroup />
      {pathname.includes("category")
        ? categoryClass[i]?.map((e) => (
            <FilterGroup
              key={`FilterGroup${i}`}
              name={e}
              category={category[categoryName[i]]}
              keyword={keyword}
              setKeyword={setKeyword}
            />
          ))
        : categoryName?.map((v, i) => (
            <FilterLinkGroup
              key={`FilterLinkGroup${i}`}
              name={v}
              category={category[v]}
            />
          ))}
      <div className={`text-center ${styles.PriceFilterContainer}`}>
        <h5 className={styles.FilterTitle} style={{ justifyContent: "center" }}>
          價格篩選
        </h5>
        <div className="d-flex justify-content-center gap-3">
          <div className={styles.PriceInput}>
            <label htmlFor="filterMin">$</label>
            <input
              id="filterMin"
              type="number"
              placeholder="最少"
              value={minPrice === "" ? "" : minPrice}
              onChange={handleMinPriceChange}
              onBlur={() => {
                if (minPrice === "" || isNaN(minPrice)) {
                  setMinPrice(0);
                  priceSliderRef.current?.noUiSlider.set([0, maxPrice]);
                }
              }}
            />
            <span>元</span>
          </div>
          <div className={styles.PriceInput}>
            <label htmlFor="filterMax">$</label>
            <input
              id="filterMax"
              type="number"
              placeholder="最多"
              value={maxPrice === "" ? "" : maxPrice}
              onChange={handleMaxPriceChange}
              onBlur={() => {
                if (maxPrice === "" || isNaN(maxPrice)) {
                  setMaxPrice(maxPrice);
                  priceSliderRef.current?.noUiSlider.set([minPrice, maxPrice]);
                }
              }}
            />
            <span>元</span>
          </div>
        </div>
        <div id="priceRange" ref={priceSliderRef} className="mt-3"></div>
        <button
          className={`btn btn-outline-danger mt-3 ${styles.ClearFilterBtn}`}
          onClick={() => {
            setMinPrice(0);
            setMaxPrice(maxPrice);
            if (priceSliderRef.current?.noUiSlider) {
              priceSliderRef.current.noUiSlider.set([0, maxPrice]);
            }
          }}
        >
          清除搜尋
        </button>
      </div>

      <a href="">
        <figure>
          <img
            src="/product/DM/DM_aside.png"
            alt="廣告"
            className="img-fluid"
          />
        </figure>
      </a>
    </aside>
  );
}
