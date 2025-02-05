'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const TeacherSection = () => {
  const [state, setState] = useState(null);
  
  return (
    <section className="text-center mb-3">
      <h3 className="mb-3 m-title">嚴選的師資團隊</h3>
      <div className=" mb-5">
        <p>
          我們對寵物師資的挑選份外嚴格，必須有豐富的經驗、耐心、傾聽能力、堅強的心志，才能陪伴飼主和狗狗一起經歷改變。
        </p>
        <p>
          我們的宗旨是：用愛與同理將每個毛孩當成自己的孩子來教導與照護，用正向的方式引導毛孩的心理及生理，相信每個毛孩都有機會改變！
        </p>
      </div>
      <div className="d-flex justify-content-center mb-5">
        <Link
          className="teacher-btn text-center text-decoration-none"
          href="/teacher/list"
        >
          read more
        </Link>
      </div>
      <h3 className="mb-3 m-title">熱門師資</h3>
      <div className="row">
        {["1", "2", "3", "4"].map((_, index) => (
          <div className="col-3" key={index}>
            <div className="card" style={{ width: "18.75rem" }}>
              <img src="..." className="card-img-top" alt="..." />
              <div className="card-body">
                <p className="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TeacherSection;
