import React,{memo} from 'react'
import Slider from 'react-slick';
import {Product} from '../Index'

const CustomSlider = ({ product, activedtab, normal, dispatch, so = 3, Css = 'flex justify-between' }) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    autoplay: true,
    arrows: window.innerWidth >= 900,
    autoplaySpeed: 7000,
    arrows: false,
    responsive: [
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        },
      },
      {
        breakpoint: 700,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
    ]
  };
  return (
    <>
      {(product && so === 3) ? <Slider {...settings}>
         {
          product?.map((el)=>(
            <Product 
              Style='cursor-pointer relative w-full max-w-[250px] text-base mx-2 px-[2px] sm:px-[10px] pb-4'
            pid = {el._id}
            dispatch={dispatch}
            key = {el.id}
            productData={el}
            isNew={activedtab}
            normal={normal}/>
            
          ))
         }
      </Slider> : <div className={Css}>
          {
            product?.map((el) => (
              <Product
                Style='cursor-pointer mx-auto relative w-full w1230:max-w-[250px] md:max-w-[280px] w-1000:max-w-[330px] w350:max-w-[150px]  w-1200:max-w-[350px]  max-w-[220px] text-base mx-2 px-[2px] sm:px-[10px] pb-4'
                pid={el._id}
                dispatch={dispatch}
                key={el.id}
                productData={el}
                isNew={activedtab}
                normal={normal} />

            ))
          }
        </div>}
    </>
  )
}

export default memo(CustomSlider)