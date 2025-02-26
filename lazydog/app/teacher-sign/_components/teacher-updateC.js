"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { updateCourse } from "@/services/teachersignService";
import styles from "../css/teacherSignUpdate.module.css";
import CourseIdPage from "@/app/course/[courseId]/page";

export default function TeacherUpdateC() {
  const router = useRouter();
  const params = useParams();
  const sessionCode = params.sessionId;

  // cs 有course和session的資料
  const [cs, setCS] = useState({});
  const [mainpic, setMainpic] = useState([]);
  const [otherpics, setOtherpics] = useState([]);
  const [types, setTypes] = useState([]);
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/teacher/mycourse/${sessionCode}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("loginWithToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        // console.log(data.data.otherpics);
        // console.log(data.data.places);
        setCS(data.data.courses[0]);
        setMainpic(data.data.mainpic[0]);
        setOtherpics(data.data.otherpics);
        setTypes(data.data.types);
        setPlaces(data.data.places);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  }, [sessionCode]);

  // 表單變更
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (files) {
      if (name === "mainpic") {
        setMainpic(files[0]); // 更新主圖片
      } else if (name === "otherpics") {
        setOtherpics([...files]); // 更新其他圖片，轉為陣列
      }
    } else {
      setCS((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // 圖片變更
  const handleDelete = (id) => {
    setOtherpics(otherpics.filter((other) => other.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 更新至後台
    const courseData = {
      name: cs.name,
      type_id: cs.type_id,
      price: cs.price,
      duration: cs.duration,
      description: cs.description,
      notice: cs.notice,
      qa: cs.qa,
      CourseId: cs.course_id,
    };

    const sessionData = {
      max_people: cs.max_people,
      class_dates: cs.class_dates,
      start_date: cs.start_date,
      area_id: cs.area_id,
      start_time: cs.start_time,
      end_time: cs.end_time,
      courseId: cs.course_id,
      sessionId: cs.id,
    };

    const sessionId = cs.id;
    const courseId = cs.course_id;

    const formData = new FormData();
    formData.append("courseData", JSON.stringify(courseData));
    formData.append("sessionData", JSON.stringify(sessionData));
    formData.append("courseId", courseId);
    formData.append("sessionId", sessionId);
    if (mainpic) {
      formData.append("mainImage", mainpic);
    }
    if (otherpics.length > 0) {
      otherpics.forEach((pic, index) => {
        formData.append("otherImages", pic);
      });
    }

    fetch(`http://localhost:5000/teacher/mycourse/${sessionCode}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("loginWithToken")}`,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        alert("資料更新成功！");
        console.log("更新成功:", data);
      })
      .catch((err) => console.error("Error updating data:", err));
  };

  const changepage = (path) => {
    if (path) {
      router.push(`/teacher-sign/${path}`);
    }
  };

  return (
    <>
      <div className={`col-lg-9 col-md-12 col-12`}>
        <div className={`p-5 ${styles.right}`}>
          <h3 className={`mb-4 ${styles.tTitle}`}>編輯該梯次</h3>
          <form onSubmit={handleSubmit}>
            <section className={`row g-4 mb-5 ${styles.section1}`}>
              <div className={`col-md-12`}>
                <label className={`form-label ${styles.labels}`}>
                  課程名稱
                </label>
                <input
                  type="text"
                  className={`form-control`}
                  value={cs.name}
                  disabled
                  readOnly
                />
              </div>
              <div className={`col-md-6 mt-3`}>
                <label className={`form-label ${styles.labels}`}>
                  課程類別
                </label>
                <select
                  className={`form-select`}
                  value={cs?.type_id}
                  disabled
                  readOnly
                >
                  {types.map((t) => (
                    <option key={t.type_id} value={t.type_id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className={`col-md-6 mt-3`}>
                <label className={`form-label ${styles.labels}`}>
                  課程金額
                </label>
                <input
                  type="text"
                  className={`form-control`}
                  value={cs.price}
                  disabled
                  readOnly
                />
              </div>
              <div className={`col-md-6 mt-3`}>
                <label className={`form-label ${styles.labels}`}>總時數</label>
                <input
                  type="text"
                  className={`form-control`}
                  value={cs.duration}
                  disabled
                  readOnly
                />
              </div>
              <div className={`col-md-6 mt-3`}>
                <label className={`form-label ${styles.labels}`}>
                  報名人數限制<span className={styles.must}>*</span>
                </label>
                <input
                  type="text"
                  className={`form-control  ${styles.controls}`}
                  value={cs.max_people}
                  onChange={handleChange}
                />
              </div>
            </section>
            <section className={`row g-4 mb-5 ${styles.section2}`}>
              <div className={`col-md-12`}>
                <label className={`form-label ${styles.labels}`}>
                  該梯每堂課日期<span className={styles.must}>*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${styles.controls}`}
                  placeholder={`範例: 2025 【台北】 08/17、08/24、08/31、09/07、09/14 、09/21、09/28`}
                  value={cs.class_dates}
                  name="class_dates"
                  onChange={handleChange}
                />
              </div>
              <div className={`col-md-6 mt-3`}>
                <label className={`form-label ${styles.labels}`}>
                  開課日期<span className={styles.must}>*</span>
                </label>
                <input
                  type="text"
                  className={`form-control  ${styles.controls}`}
                  value={cs.start_date}
                  name="start_date"
                  onChange={handleChange}
                />
              </div>
              <div className={`col-md-6 mt-3`}>
                <label className={`form-label ${styles.labels}`}>
                  開課地點<span className={styles.must}>*</span>
                </label>
                <select
                  className={`form-select ${styles.controls}`}
                  value={cs?.area_id}
                  name="area_id"
                  onChange={handleChange}
                >
                  {places.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.region}
                    </option>
                  ))}
                </select>
              </div>
              <div className={`col-md-12 mt-3`}>
                <label className={`form-label ${styles.labels}`}>
                  上課時間<span className={styles.must}>*</span>
                </label>
                <div className={`d-flex`}>
                  <input
                    type="text"
                    className={`form-control  ${styles.controls}`}
                    value={cs.start_time}
                    name="start_time"
                    onChange={handleChange}
                  />
                  <span className={`align-self-center p-2`}>~</span>
                  <input
                    type="text"
                    className={`form-control  ${styles.controls}`}
                    value={cs.end_time}
                    name="end_time"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </section>
            <section className={`row g-4 mb-5  ${styles.section3}`}>
              <div className={`col-md-12 mt-3`}>
                <label className={`form-label ${styles.labels}`}>
                  課程介紹
                </label>
                <textarea
                  className={`form-control  ${styles.scrollOrg}`}
                  style={{ resize: "none" }}
                  id="exampleFormControlTextarea1"
                  rows={8}
                  value={cs.description}
                  disabled
                  readOnly
                />
              </div>
              <div className={`col-md-12 mt-3`}>
                <label className={`form-label ${styles.labels}`}>
                  注意事項
                </label>
                <textarea
                  className={`form-control ${styles.scrollOrg}`}
                  style={{ resize: "none" }}
                  id="exampleFormControlTextarea1"
                  rows={8}
                  value={cs.notice}
                  disabled
                  readOnly
                />
              </div>
              <div className={`col-md-12 mt-3`}>
                <label className={`form-label ${styles.labels}`}>Q&amp;A</label>
                <textarea
                  className={`form-control ${styles.scrollOrg}`}
                  style={{ resize: "none" }}
                  id="exampleFormControlTextarea1"
                  rows={8}
                  value={cs.qa}
                  disabled
                  readOnly
                />
              </div>
            </section>
            <section className={`row g-1 mb-5 ${styles.section4}`}>
              <div className={`col-md-12 col-12 mt-3`}>
                <label className={`form-label`}>課程圖片</label>
              </div>

              <div className={`col-md-5 col-12 mt-4 mb-5 ${styles.mainPic}`}>
                <div className={styles.imageCard}>
                  <img
                    className={styles.imgCr}
                    src={`/course/img/${mainpic?.url}`}
                    alt={`${cs.name}-課程主圖`}
                  />
                  {/* <button 
                          type="button" 
                          className={`${styles.deleteBtn1} ${styles.deletPic}`}
                          onClick={()=> setMainpic(null)}>×</button> */}
                </div>
                {/* <button type="button" className={`btn btn-primary btn-sm ${styles.addPicBtn}`} >
                          新增
                        </button> */}
                {/* <input type="file" id="imageUpload" className={`form-control d-none add`} accept="image/*" /> */}
              </div>
              <div className={`col-md-7 col-12 mt-4 mb-5 ${styles.otherPic}`}>
                <div
                  id="imageContainer"
                  className={`d-flex flex-wrap gap-3 mb-2`}
                >
                  {otherpics?.map((other) => (
                    <div key={other.id} className={styles.imageCard}>
                      <img
                        className={`${styles.imgCr} ${styles.pics}`}
                        src={`/course/img/${other.url}`}
                        alt={`${cs.name}-課程其他圖片`}
                      />
                      {/* <button 
                              type="button" 
                              className={`${styles.deleteBtn} ${styles.deletPic}`}
                              onClick ={() => handleDelete(other.id)}>×</button> */}
                    </div>
                  ))}
                </div>
                {/* <button type="button" className={`btn btn-primary btn-sm ${styles.addPicBtn}`} >
                          新增
                        </button> */}
                {/* <input type="file" id="imageUpload" className={`form-control d-none add`} accept="image/*" multiple /> */}
              </div>
            </section>

            {/* 按鈕區 */}
            <div className={`d-flex justify-content-end gap-3 border-top mt-5`}>
              <button
                type="button"
                className={`btn btn-sm px-4 mt-4 ${styles.cancleBtn}`}
                onClick={() => changepage("list")}
              >
                <a className={styles.cancleBtnA} href={`/teacher-sign/list`}>
                  取消
                </a>
              </button>
              <button
                type="submit"
                className={`btn btn-primary btn-sm px-4 mt-4 ${styles.submitBtn}`}
              >
                <a className={styles.submitBtnA}>儲存</a>
              </button>
              <button
                type="submit"
                className={`btn btn-primary btn-sm px-4 mt-4 ${styles.submitBtn}`}
              >
                <a className={styles.submitBtnA}>刪除</a>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
