"use client";

import React, { useEffect, useState } from "react";
import couponStyles from "./userCoupon.module.css";
import { useRouter } from "next/navigation";
import { usePhotoUpload } from "@/hooks/usePhotoUpload";
import Header from "../components/layout/header";
import MyMenu from "../components/layout/myMenu";
import Product from "./_components/product";
import Course from "./_components/course";
import Hotel from "./_components/hotel";
import { useOrder } from "@/hooks/use-order";

export default function ProfileCouponPage(props) {
  const router = useRouter();
  const { orders, hotelOrders } = useOrder();
  const [activeTab, setActiveTab] = useState("全部"); // 新增狀態來追蹤當前選中的頁籤

  const { fileInputRef, avatarRef, uploadPhoto, fileChange, deletePhoto } =
    usePhotoUpload("/images/hotel/hotel-images/page-image/default-avatar.png");

  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  // 根據選取的頁籤來決定要顯示的內容
  const renderContent = () => {
    switch (activeTab) {
      case "商品":
        return <Product orders={orders} />;
      case "課程":
        return <Course />;
      case "旅館":
        return <Hotel hotelOrders={hotelOrders} />;
      default:
        return (
          <>
            <Product orders={orders} />
            <Course />
            <Hotel hotelOrders={hotelOrders} />
          </>
        ); // 預設顯示全部
    }
  };
  //點擊頁籤時的事件
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <>
      <Header />
      <div className="container mt-5">
        <div className="row">
          {/* 左邊*/}
          <div className="d-none d-md-block col-md-3">
            <MyMenu />
          </div>
          {/* 右邊 */}
          <div className=" col-12 col-md-9 coupon-section">
            <h5 className="mb-3">我的訂單</h5>
            <ul className={`nav ${couponStyles.suNavTabs}`}>
              <li className="nav-item">
                <a
                  className={`nav-link ${couponStyles.suNavLink} ${
                    activeTab === "全部" ? "active" : ""
                  }`}
                  href="#"
                  onClick={() => handleTabClick("全部")}
                >
                  全部
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${couponStyles.suNavLink} ${
                    activeTab === "商品" ? "active" : ""
                  }`}
                  href="#"
                  onClick={() => handleTabClick("商品")}
                >
                  商品 ({orders.length})
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${couponStyles.suNavLink} ${
                    activeTab === "課程" ? "active" : ""
                  }`}
                  href="#"
                  onClick={() => handleTabClick("課程")}
                >
                  課程 ({"XXX"})
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${couponStyles.suNavLink} ${
                    activeTab === "旅館" ? "active" : ""
                  }`}
                  href="#"
                  onClick={() => handleTabClick("旅館")}
                >
                  旅館 ({hotelOrders.length})
                </a>
              </li>
            </ul>

            {/* 根據選取的頁籤來渲染內容 */}
            {renderContent()}
          </div>
        </div>
      </div>
    </>
  );
}
