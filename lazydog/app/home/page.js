"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import styles from "../../styles/modules/home.module.css";
import Header from "../components/layout/header2";
import Footer from "../components/layout/footer";

export default function HomePage(props) {
  return (
    <>
      <Header />
      <div className={styles.section1}>
        <div className={styles.words}>
          <div className={styles.sales}>
            <div className={styles.sale1}>
              <h2 className={styles.sale1Word}>活動倒數3天！</h2>
              <h2 className={styles.sale1Word}>熱門商品最高限時</h2>
            </div>
            <div className={styles.sale2}>
              <h2 className={styles.discountNum}>88</h2>
              <h2 className={styles.discountWord}>折</h2>
            </div>
            <div className={styles.sale3}>
              <p className={styles.sale3Word}>錯過這次，再等一年!</p>
              <Link href="/product" className={styles.sale3Btn}>Shop Now</Link>
            </div>
          </div>
          <div className={styles.dog}>
            <img className={styles.paw2} src="/home/img/paw2.png" alt="" />
            <img
              className={styles.dogBackground}
              src="/home/img/dogBackground.png"
              alt=""
            />
            <img className={styles.lines} src="/home//img/lines.png" alt="" />
            <img className={styles.dogPic} src="/home//img/dog.png" alt="" />
            <img className={styles.paw3} src="/home/img/paw3.png" alt="" />
          </div>
          <div className={styles.icons}>
            <img className={styles.paw1} src="/home/img/paw1.png" alt="" />
          </div>
        </div>
        <div className={styles.whiteWave}>
          <img src="/home/img/whiteWave.png" alt="" />
        </div>
      </div>

      <div className={styles.section2}>
        <div className={styles.words}>
          <h2 className={styles.shopping}>立即逛逛，給毛孩最好的生活</h2>
          <h2 className={styles.today}>今日必買 | 人氣推薦</h2>
        </div>
        <div className={styles.imgs}>
          <img
            className={styles.dogCookie}
            src="/home/img/dogCookie.png"
            alt=""
          />
          <img
            className={styles.cookieBag}
            src="/home/img/cookieBag.png"
            alt=""
          />
        </div>
        <div className={styles.productCards}>
          <div className={styles.card}>
            <div className={styles.pdPics}>
              <img className={styles.dryfood} src="/home/img/dryfood (2).jpeg" alt="" />
            </div>
            <div className={styles.pdWords}>
              <p className={styles.p}>超能狗主食罐</p>
              <p className={styles.p}>$185</p>
            </div>
          </div>
          <div className={styles.card}>
            <div className={styles.pdPics}>
              <img className={styles.dryfood} src="/home/img/dryfood (2).jpeg" alt="" />
            </div>
            <div className={styles.pdWords}>
              <p className={styles.p}>超能狗主食罐</p>
              <p className={styles.p}>$185</p>
            </div>
          </div>
          <div className={styles.card}>
            <div className={styles.pdPics}>
              <img className={styles.dryfood} src="/home/img/dryfood (2).jpeg" alt="" />
            </div>
            <div className={styles.pdWords}>
              <p className={styles.p}>超能狗主食罐</p>
              <p className={styles.p}>$185</p>
            </div>
          </div>
          <div className={styles.card}>
            <div className={styles.pdPics}>
              <img className={styles.dryfood} src="/home/img/dryfood (2).jpeg" alt="" />
            </div>
            <div className={styles.pdWords}>
              <p className={styles.p}>超能狗主食罐</p>
              <p className={styles.p}>$185</p>
            </div>
          </div>
          <div className={styles.card}>
            <div className={styles.pdPics}>
              <img className={styles.dryfood} src="/home/img/dryfood (2).jpeg" alt="" />
            </div>
            <div className={styles.pdWords}>
              <p className={styles.p}>超能狗主食罐</p>
              <p className={styles.p}>$185</p>
            </div>
          </div>
        </div>

        <div className={styles.brownWave}>
          <img src="/home/img/brownWaves.png" alt="" />
        </div>
      </div>

      <div className={styles.section3}>
        <div className={styles.discountPic}>
          <img className={styles.girlDog} src="/home/img/girl&dog.png" alt="" />
          <img
            className={styles.discountPic3}
            src="/home/img/discountPic3.png"
            alt=""
          />
          <h2 className={styles.discountWord}>優惠的折扣</h2>
          <Link href="#" className={styles.readmoreBtn}>Read More</Link>
          <div className={styles.circle}>
            20%
            <br />
            offer
          </div>
        </div>
        <div className={styles.hotel}>
          <div className={styles.map}>
            <img src="/home/img/taiwan.png" alt="" />
          </div>
          <div className={styles.hotelWords}>
            <h2 className={styles.h2}>毛孩的度假天堂</h2>
            <p className={styles.p}>立即下訂，為您的毛孩子預約一個愉快的假期！</p>
            <Link href="/hotel-coupon" className={styles.bookBtn}>Book Now</Link>
          </div>
          <div className={styles.hotelViews}>
            <img className={styles.dryfood} src="/home/img/dryfood (5).jpeg" alt="" />
            <h5 className={styles.h5}>汪汪星球</h5>
          </div>
        </div>
        <div className={styles.icons}>
          <img
            className={styles.firework1}
            src="/home/img/fireworks.png"
            alt=""
          />
          <img
            className={styles.firework2}
            src="/home/img/fireworks.png"
            alt=""
          />
        </div>
        <div className={styles.whiteWave2}>
          <img className={styles.wave} src="/home/img/whiteWave2.png" alt="" />
        </div>
      </div>

      <div className={styles.section4}>
        <h2 className={styles.section4Title}>會員限定優惠</h2>
        <div className={styles.userCards}>
          <div className={`${styles.card} ${styles.card1}`}>
            <p className={styles.p1}>首購會員</p>
            <p className={styles.p2}>現折50</p>
            <h5  className={styles.card1Word}>單筆消費滿 $ 500 即可使用</h5>
          </div>
          <div className={`${styles.card} ${styles.card2}`}>
            <div className={styles.shipIcon}>
              <img className={styles.shipIcon} src="/home/img/shipIcon.png" alt="" />
            </div>
            <h5 className={styles.card2Word}>滿額免運</h5>
            <p className={styles.card2P}>超取 $ 1500 / 宅配 $ 2000</p>
          </div>
          <div className={`${styles.card} ${styles.card3}`}>
            <div className={styles.icon}>
              <img className={styles.moneyIcon} src="/home/img/moneyIcon.png" alt="" />
            </div>
            <h5 className={styles.card5Word}>購物金回饋</h5>
            <p className={styles.card5P}>
              會員最高享<span className={styles.discount8}> 8% </span>消費回饋
            </p>
          </div>
          <div className={`${styles.card} ${styles.card4}`}>
            <div >
              <img className={styles.qrcode} src="/home/img/qrcode.png" alt="" />
            </div>
            <h4 className={styles.h4}>加入好友</h4>
            <p className={styles.p}>獲得最新優惠資訊</p>
          </div>
        </div>
        <Link href="/register" className={styles.signupBtn}>立即加入會員</Link>
        <div className={styles.yellowPaws}>
          <img src="/home/img/yellowPaws.png" alt="" />
        </div>
      </div>

      <div className={styles.btns}>
        <Link href="/hotel-coupon" className={styles.ticketIcon}>
          <img src="/home/img/ticketIcon.png" alt="" />
        </Link>
        <button className={styles.topIcon}>
          <img src="/home/img/topIcon.png" alt="" />
        </button>
      </div>
      <Footer/>
    </>
  );
}
