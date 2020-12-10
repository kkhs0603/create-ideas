import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import React from 'react';
import Slider from 'react-slick';
import Style from './TopSlider.module.scss';

const TopSlider = () => {
  const settings = {
    // dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    autoplay: true,
    autoplaySpeed: 4000,
  };
  return (
    <Slider className={Style.slider} {...settings}>
      <div>
        <h1 className={Style.img}>1</h1>
      </div>
      <div>
        <h1 className={Style.img}>2</h1>
      </div>
      <div>
        <h1 className={Style.img}>3</h1>
      </div>
    </Slider>
  );
};

export default TopSlider;
