import React, { memo, useState } from 'react'
import Slider from 'react-slick';
import 'animate.css';

import { slides } from 'Ultils/DataFormate'

import WithRase from 'hocs/withRase';
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
    // customPaging: (i) => (
    //   <div className='w-[100px] ml-5'>
    //     {slides[i].name}
    //   </div>
    // ),
    arrows: showButtons,
    // prevArrow: <SamplePrevArrow />,
    // nextArrow: <SampleNextArrow />
  };

  return (
    // <div>
    //    <div className='cursor-pointer mt-5 flex flex-col sm:px-4 px-2  items-center'>
               
    //     </div>
      <div
      className='mt-6 rounded-sm w-full animate__animated animate__zoomIn max-h-[450px] shadow-xl'
        onMouseEnter={() => setShowButtons(true)}
        onMouseLeave={() => setShowButtons(false)}
      >
        <Slider {...settings}>
          {slides.map((slide, index) => (
            <div key={index} className='relative w-full '>
              <img
                src={slide.imgSrc}
                alt={slide.name}
                className='w-full h-full rounded-lg object-cover max-h-[450px]'
              />
              {slide.content}
            </div>
          ))}
        </Slider>
      </div >
    // </div>
    
  )
}

export default WithRase(memo(Banner))



