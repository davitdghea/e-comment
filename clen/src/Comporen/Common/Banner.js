import React, { memo, useState } from 'react'
import Slider from 'react-slick';
import 'animate.css';
import { slides } from 'Ultils/DataFormate'
const Banner = () => {
  const [showButtons, setShowButtons] = useState(false)
  // const SamplePrevArrow = (props) => {
  //   const { className, style, onClick } = props;
  //   return (
  //     <div
  //       className={`${className} animate__animated animate__fadeInLeft ml-[25px] absolute z-50`}
  //       style={{ ...style, display: "block" }}
  //       onClick={onClick}
  //     />
  //   );
  // };

  // const SampleNextArrow = (props) => {
  //   const { className, style, onClick } = props;
  //   return (
  //     <div
  //       className={`${className} animate__animated animate__fadeInRight mr-[25px] absolute z-50`}
  //       style={{ ...style, display: "block" }}
  //       onClick={onClick}
  //     />
  //   );
  // };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 10000,
    customPaging: (i) => (
      <div className='w-[100px] ml-5'>
        {slides[i].name}
      </div>
    ),
    arrows: showButtons,
    // prevArrow: <SamplePrevArrow />,
    // nextArrow: <SampleNextArrow />
  };
  return (
    <div 
    className='w-full animate__animated animate__zoomIn mt-5 h-max-[325px] shadow-xl'
      onMouseEnter={() => setShowButtons(true)}
      onMouseLeave={() => setShowButtons(false)}
      >
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={index} className='relative w-full'>
            <img
              src={slide.imgSrc}
              alt={slide.name}
              className='w-full h-full object-cover max-h-[325px]'
            />
            {slide.content}
          </div>
        ))}
    </Slider>
    </div >
  )
}

export default memo(Banner)



