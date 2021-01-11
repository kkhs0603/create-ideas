import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React from "react";
import Slider from "react-slick";
import Style from "./TopSlider.module.scss";
import Image from "next/image";

const TopSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    autoplay: true,
    autoplaySpeed: 5000,
  };
  return (
    <Slider className={Style.slider} {...settings}>
      <div>
        <Image src="/topPage/01.png" alt="01" className={Style.img} unsized />
      </div>
      <div>
        <Image src="/topPage/02.gif" alt="02" className={Style.img} unsized />
      </div>
      <div>
        <Image src="/topPage/03.gif" alt="03" className={Style.img} unsized />
      </div>
    </Slider>
  );
};

export default TopSlider;
