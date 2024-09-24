import React,{memo} from 'react'
import Slider from 'react-slick';
import {Product} from '../Index'
const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 7000,
  };
const CustomSlider = ({ product, activedtab, normal, dispatch }) => {
 
  return (
    <>
        {product && <Slider {...settings}>
         {
          product?.map((el)=>(
            <Product 
            pid = {el._id}
            dispatch={dispatch}
            key = {el.id}
            productData={el}
            isNew={activedtab}
            normal={normal}/>
            
          ))
         }
      </Slider>}
    </>
  )
}

export default memo(CustomSlider)