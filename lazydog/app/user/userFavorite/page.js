"use client";

import React, { useState, useEffect } from "react";
import {
  getProductFavorites,
  updateProductFavoriteStatus ,
  getHotelFavorites,
  removeHotelFavorite,
  getCourseFavorites,
  removeCourseFavorite,
} from "@/services/allFavoriteService";
import { useAuth } from "@/hooks/use-auth";

export default function UserFavoritePage() {
  const { user } = useAuth();
  const [pdFavoriteList, setPdFavoriteList] = useState([]);
  const [productFavorites, setProductFavorites] = useState([]); // 商品收藏
  const [hotelFavorites, setHotelFavorites] = useState([]); // 旅館收藏
  const [courseFavorites, setCourseFavorites] = useState([]); // 課程收藏
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("User Data:", user);
    if (user?.id) {
      fetchFavorites();
    }
  }, [user]);

  // 獲取商品詳情
  const fetchProductDetails = async (pdFavoriteList) => {
    try {
      const BASE_IMAGE_URL = "http://localhost:3000/product/img/";

      const promises = pdFavoriteList.map(async (productID) => {
        if (productID) {
          const res = await fetch(
            `http://localhost:5000/api/products/${productID}`
          );
          if (!res.ok) throw new Error(`資料要求失敗: ${productID}`);
          return await res.json();
        }
      });

      const results = await Promise.all(promises);

      const productsWithDetails = results.map((e) => {
        const productData = e.data[0];
        let imgList = productData.img ? productData.img.split(",") : [];
        let firstImage = imgList.length > 0 ? imgList[0].trim() : "";

        let imageUrl = firstImage
          ? `${BASE_IMAGE_URL}${encodeURIComponent(
              productData.name.trim()
            )}${encodeURIComponent(firstImage)}`
          : "/lazydog.png";

        return {
          id: productData.id,
          name: productData.name,
          image_url: imageUrl,
          price: productData.price,
        };
      });

      setProductFavorites(productsWithDetails);
    } catch (err) {
      console.error("資料要求失敗:", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchProductDetails(pdFavoriteList);
  }, [pdFavoriteList]);

  // 獲取所有收藏資料
  const fetchFavorites = async () => {
    try {
      setLoading(true);

      // 取得旅館收藏
      const hotelResponse = await getHotelFavorites();
      if (hotelResponse.success && Array.isArray(hotelResponse.data.data)) {
        setHotelFavorites([...hotelResponse.data.data]);
      } else {
        console.log("未獲取到旅館收藏");
      }

      // 取得商品收藏
      const productResponse = await getProductFavorites();
      if (productResponse.success && Array.isArray(productResponse.data)) {
        const allProductIDs = productResponse.data
          .filter((v) => v.user_id == user?.id)
          .flatMap((v) => v.productID_list.split(","));
        setPdFavoriteList([...new Set(allProductIDs)]);
      } else {
        console.log("未獲取到商品收藏");
      }

      // 取得課程收藏並處理圖片
      const courseResponse = await getCourseFavorites(user.id);
      if (courseResponse.success && Array.isArray(courseResponse.data)) {
        const formattedData = courseResponse.data.map((item) => ({
          ...item,
          main_pic: getCourseImageUrl(item.main_pic),
        }));
        setCourseFavorites(formattedData);
      } else {
        console.log(" 未獲取到課程收藏");
      }
    } catch (error) {
      console.error("fetch 課程favorites失敗喔:", error);
    } finally {
      setLoading(false);
    }
  };

  const BASE_IMAGE_URL = "http://localhost:3000/course/img/";

  const getCourseImageUrl = (main_pic) => {
    if (!main_pic) return "/lazydog.png"; // 預設圖片

    return `${BASE_IMAGE_URL}${encodeURIComponent(main_pic.trim())}`;
  };
  const fetchCourseFavorites = async () => {
    try {
      const response = await getCourseFavorites(user.id);

      if (response.success && Array.isArray(response.data)) {
        // 確保圖片 URL 正確
        const formattedData = response.data.map((item) => ({
          ...item,
          main_pic: getCourseImageUrl(item.main_pic),
        }));

        setCourseFavorites(formattedData);
      } else {
        console.log(" 未獲取到課程收藏資料");
      }
    } catch (error) {
      console.error(" fetchCourseFavorites 發生錯誤:", error);
    }
  };

  // 移除課程收藏
  const handleRemoveCourseFavorite = async (favoriteId) => {
    try {
      const response = await removeCourseFavorite(favoriteId, user.id);
      if (response.success) {
        setCourseFavorites((prevFavorites) =>
          prevFavorites.filter((item) => item.id !== favoriteId)
        );
      }
    } catch (error) {
      console.error("移除失敗拉:", error);
    }
  };

  // 移除商品收藏
  const handleRemoveProductFavorite = async (favoriteId) => {
    try {
      console.log(`正在軟刪除商品收藏: 收藏ID = ${favoriteId}, 使用者ID = ${user.id}`);
  
      const response = await updateProductFavoriteStatus(user.id, [favoriteId], true);
      console.log(" 軟刪除 API 回應:", response);
  
      if (response.success) {
        setProductFavorites((prevFavorites) =>
          prevFavorites.filter((item) => item.id !== favoriteId) 
        );
      }
    } catch (error) {
      console.error("移除收藏失敗:", error);
    }
  };
  // 移除旅館收藏
  const handleRemoveHotelFavorite = async (favoriteId) => {
    try {
      console.log(
        `正在移除旅館收藏: 收藏ID = ${favoriteId}, 使用者ID = ${user.id}`
      );

      const response = await removeHotelFavorite(favoriteId, user.id);

      console.log("移除回應:", response);

      if (response.success) {
        setHotelFavorites((prevFavorites) =>
          prevFavorites.filter((item) => item.id !== favoriteId)
        );
      }
    } catch (error) {
      console.error("移除旅館收藏失敗:", error);
    }
  };

  useEffect(() => {
    console.log(" 更新後的課程收藏:", courseFavorites);
  }, [courseFavorites]);
  useEffect(() => {
    console.log(" 更新後的旅館收藏:", hotelFavorites);
  }, [hotelFavorites]);
  useEffect(() => {
    console.log(" 更新後的商品收藏:", productFavorites);
  }, [productFavorites]);

  return (
    <div className="col-md-9">
      <div className="d-flex justify-content-between my-2">
        <h4 className="text-center mb-4">我的最愛</h4>
      </div>

      {loading ? (
        <p className="text-center">載入中...</p>
      ) : (
        <>
          {/* 商品收藏 */}
          <div className="mb-5">
            <h6>商品收藏</h6>
            <div className="row">
              {productFavorites.length > 0 ? (
                productFavorites.map((item, index) => (
                  <div className="col-md-4" key={index}>
                    <div
                      className="card position-relative mb-4 shadow-sm"
                      style={{
                        overflow: "hidden",
                        borderRadius: "10px",
                      }}
                    >
                      {/* 移除按鈕 */}
                      <button
                        className="btn btn-danger position-absolute"
                        style={{
                          right: "10px",
                          top: "10px",
                          zIndex: 10,
                          width: "30px",
                          height: "30px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 0,
                          borderRadius: "50%",
                          fontSize: "16px",
                        }}
                        onClick={() => handleRemoveProductFavorite(item.id)}
                      >
                        ✖
                      </button>

                      {/* 商品圖片（修正 URL 編碼） */}
                      <img
                        src={item.image_url}
                        className="card-img-top"
                        alt={item.name || "商品圖片"}
                        onError={(e) => (e.target.src = "/lazydog.png")}
                        style={{ height: "200px", objectFit: "cover" }}
                      />

                      <div className="card-body text-center">
                        <h5 className="card-title">{item.name}</h5>
                        <p className="card-text">${item.price}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center">目前沒有收藏的商品。</p>
              )}
            </div>
          </div>

          {/* 旅館收藏 */}
          <div className="mb-5">
            <h6>旅館收藏</h6>
            <div className="row">
              {hotelFavorites.length > 0 ? (
                hotelFavorites.map((item) => (
                  <div className="col-md-4" key={item.id}>
                    <div
                      className="card position-relative mb-4 shadow-sm"
                      style={{
                        overflow: "hidden",
                        borderRadius: "10px",
                      }}
                    >
                      {/* 移除按鈕 */}
                      <button
                        className="btn btn-danger position-absolute"
                        style={{
                          right: "10px",
                          top: "10px",
                          zIndex: 10,
                          width: "30px",
                          height: "30px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 0,
                          borderRadius: "50%",
                          fontSize: "16px",
                        }}
                        onClick={() =>
                          handleRemoveHotelFavorite(item.id, item.course_id)
                        } // 確保傳 course_id
                      >
                        ✖
                      </button>

                      {/* 旅館圖片 */}
                      <img
                        src={item.main_image_url || "/lazydog.png"}
                        className="card-img-top"
                        alt={item.name || "旅館圖片"}
                        onError={(e) => (e.target.src = "/lazydog.png")}
                        style={{ height: "200px", objectFit: "cover" }}
                      />

                      <div className="card-body text-center">
                        <h5 className="card-title">{item.name}</h5>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center">目前沒有收藏的旅館。</p>
              )}
            </div>
          </div>

          {/* 課程收藏 */}
          <div className="mb-5">
            <h6>課程收藏</h6>
            <div className="row">
              {courseFavorites.length > 0 ? (
                courseFavorites.map((item) => (
                  <div className="col-md-4" key={item.id}>
                    <div
                      className="card position-relative mb-4 shadow-sm"
                      style={{
                        overflow: "hidden",
                        borderRadius: "10px",
                      }}
                    >
                      {/* 移除按鈕 */}
                      <button
                        className="btn btn-danger position-absolute"
                        style={{
                          right: "10px",
                          top: "10px",
                          zIndex: 10,
                          width: "30px",
                          height: "30px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 0,
                          borderRadius: "50%",
                          fontSize: "16px",
                        }}
                        onClick={() => handleRemoveCourseFavorite(item.id)}
                      >
                        ✖
                      </button>

                      {/* 課程圖片 */}
                      <img
                        src={item.main_pic || "/lazydog.png"}
                        className="card-img-top"
                        alt={item.name || "課程圖片"}
                        onError={(e) => (e.target.src = "/lazydog.png")}
                        style={{ height: "200px", objectFit: "cover" }}
                      />

                      <div className="card-body text-center">
                        <h5 className="card-title">{item.name}</h5>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center">目前沒有收藏的課程。</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
