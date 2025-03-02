"use client";

// import { auth } from "@/hooks/use-auth";

// 宣告 API 懶得打字
const API_URL = "http://localhost:5000/api/coupon";
const COUPON_USAGE_URL = "http://localhost:5000/api/coupon/usage";
const COUPON_RESTRICTION_URL = "http://localhost:5000/api/coupon/restrictions";

const getToken = () => localStorage.getItem("loginWithToken");

//詳細role限制請看server端
//API URL的part
// 取得所有優惠券
export const getCoupons = async () => {
  try {
    const token = localStorage.getItem("loginWithToken"); // 確保 token 存在
    if (!token) throw new Error("用戶未登入，請重新登入");

    const res = await fetch("http://localhost:5000/api/coupon", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(`API 錯誤: ${errorData.error || "未知錯誤"}`);
    }

    const data = await res.json();
    return { success: true, data }; // 確保返回 { success: true, data: [...] }
  } catch (error) {
    console.error("取得優惠券失敗:", error);
    return { success: false, error: error.message };
  }
};

// 取得特定優惠券OP
export const getCouponById = async (id) => {
  const token = getToken();
  const res = await fetch(`${API_URL}/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status == 403) {
    console.warn("權限不足，無法訪問此資源");
    return null;
  }

  return await res.json();
};
// code查詢優惠券
export const getCouponByCode = async (code) => {
  const token = getToken();
  const res = await fetch(`${API_URL}/code/${code}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return await res.json();
};

//  新增優惠券
export const createCoupon = async (couponData, token) => {
  if (!token) {
    console.error("未授權請求，請重新登入");
    return { error: "未授權請求，請重新登入" };
  }

  try {
    console.log("使用的 token:", token);
    console.log("傳入的 couponData:", couponData);

    const res = await fetch("http://localhost:5000/api/coupon", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(couponData),
    });

    console.log("API 響應狀態:", res.status);

    if (!res.ok) {
      const errorData = await res.json();
      console.error("新增優惠券失敗:", errorData);
      return { error: `新增失敗 (${res.status}): ${errorData.error}` };
    }

    const responseData = await res.json();
    console.log("API 響應數據:", responseData);
    return responseData;
  } catch (error) {
    console.error("API 錯誤:", error);
    console.error("錯誤堆棧:", error.stack); // 打印錯誤堆棧
    return { error: "發生錯誤，請稍後再試" };
  }
};




//  更新
export const updateCoupon = async (id, data) => {
  const token = getToken();
  if (!token) {
    return { error: "未授權請求，請重新登入" };
  }

  const formattedData = {
    ...data,
    discount_type: data.discountType ? data.discountType.toLowerCase() : "fixed", 
    discountValue: isNaN(Number(data.discountValue)) ? 0 : Number(data.discountValue),
    minAmount: isNaN(Number(data.minAmount)) ? 0 : Number(data.minAmount),
  };

  console.log("更新優惠券數據:", JSON.stringify(formattedData));

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formattedData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("更新優惠券失敗:", errorData);
      return { error: `更新失敗 (${res.status}): ${errorData.message || "未知錯誤"}` };
    }

    const result = await res.json();
    console.log(" 更新成功:", result);
    return result;
  } catch (error) {
    console.error(" API 請求錯誤:", error);
    return { error: "發生錯誤，請稍後再試" };
  }
};


// 軟刪除
export const softDeleteCoupon = async (couponId) => {
  const token = localStorage.getItem("loginWithToken");

  try {
    const response = await fetch(
      `http://localhost:5000/api/coupon/${couponId}/soft-delete`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorMessage = await response.text(); // 讀取錯誤訊息
      throw new Error(`刪除失敗: ${errorMessage}`);
    }

    return await response.json();
  } catch (error) {
    console.error("刪除優惠券失敗:", error);
    return { success: false, message: error.message };
  }
};

export const getCouponss = async (status, type) => {
  if (typeof window === "undefined") return null; // 確保只在瀏覽器執行

  const token = localStorage.getItem("loginWithToken");

  if (!token) {
    console.warn("沒有 Token，請重新登入");
    return null;
  }

  try {
    const res = await fetch(
      `http://localhost:5000/api/coupon/usage/usage?status=${status}&type=${type}`, // 只傳 status 和 type
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 用 Token 驗證身份
        },
      }
    );

    if (!res.ok) {
      const errorResponse = await res.json(); // 解析錯誤訊息
      console.error(`API 請求失敗，狀態碼：${res.status}，錯誤訊息：`, errorResponse);
      return { success: false, error: errorResponse.message || "API 請求失敗" };
    }

    const response = await res.json();
    return response;
  } catch (error) {
    console.error("獲取優惠券紀錄時發生錯誤：", error);
    return { success: false, error: "無法獲取優惠券紀錄" };
  }
};




// 領取優惠券(手領)
export const claimCoupon = async (couponId) => {
  const token = localStorage.getItem("loginWithToken");
  if (!token) {
    alert("請先登入");
    window.location.href = "/login";
    return;
  }
  const res = await fetch(`${COUPON_USAGE_URL}/claim`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ couponId }),
  });

  const response = await res.json();
  console.log("API 回傳結果:", response);
  return response;
};
// 透過code領取優惠券(打字領)
export const claimCouponByCode = async (code) => {
  const token = localStorage.getItem("loginWithToken");
  if (!token) {
    alert("請先登入");
    window.location.href = "/login";
    return;
  }

  try {
    // 從 JWT Token 解析 `userId`
    const payload = JSON.parse(atob(token.split(".")[1])); 
    const userId = payload.id;

    const res = await fetch("http://localhost:5000/api/coupon/usage/typing", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, code }), // ✅ 確保 `userId` 被傳遞
    });

    const response = await res.json();
    console.log("API 回應:", response);
    return response;
  } catch (error) {
    console.error("解析 token 錯誤：", error);
  }
};


// 使用優惠券
export const useCoupon = async (couponId) => {
  const token = getToken();
  const res = await fetch(`${COUPON_USAGE_URL}/use/${couponId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return await res.json();
};
// 刪除使用者優惠券 //可以考慮不要用
export const deleteUserCoupon = async (couponId) => {
  const token = getToken();
  const res = await fetch(`${COUPON_USAGE_URL}/delete/${couponId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return await res.json();
};
// 取得優惠券的使用限制
export const getCouponRestrictions = async (couponId) => {
  const token = getToken();
  const res = await fetch(`${COUPON_RESTRICTION_URL}/${couponId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return await res.json();
};
//新增同上
export const createCouponRestriction = async (couponId, data) => {
  const token = getToken();
  const res = await fetch(`${COUPON_RESTRICTION_URL}/${couponId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return await res.json();
};
//delete 同上 ...待測試
export const deleteCouponRestriction = async (restrictionId) => {
  const token = getToken();
  const res = await fetch(`${COUPON_RESTRICTION_URL}/${restrictionId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return await res.json();
};
