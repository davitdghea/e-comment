import React, { memo, useState } from 'react'
import { formatMoney } from '../../Ultils/Hellpers'
import { renderStarFromNumber } from "../../Ultils/Hellpers"
import SelectOption from '../Search/SelectOption'
import icons from '../../Ultils/Icons'
import { createSearchParams, Link } from 'react-router-dom'
import 'animate.css'
import { apiUpdateCart, apiUpdateWithlist } from 'Apis/User'
import {  useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { getCurrent } from 'St/User/AsyncAction'
import Swal from 'sweetalert2'
import { blue } from '@mui/material/colors'
import path from 'Ultils/Path'
import WithRase from 'hocs/withRase'


const { AiFillEye, FaCartPlus, FaHeart } = icons
const Product = ({ productData, isNew, normal, dispatch, navigate, location,pid }) => {
 const {current} = useSelector(state => state.user)  
  const [isShowOption, setIsShowOption] = useState(false)
  const handleClickOptions = async (flag) =>{
    if (flag ==='CART'){
      if (!current) return Swal.fire({
        title: 'Almost...',
        text: "Please login first!",
        icon: "info",
        showCancelButton: true,
        cancelButtonText: 'Not now!',
        confirmButtonText: "Go login page"
      }).then((rs) => {
        if (rs.isConfirmed) navigate({
          pathname: `/${path.LOGIN}`,
          search: createSearchParams({ redirect: location.pathname}).toString()
        })
      })
      const response = await apiUpdateCart({
        pid:productData._id,
        color: productData.color,
        price: productData.price,
        thumb: productData.thumb,
        title: productData.title
      })
      
    if(response.success) {
      toast.success(response.mes)
      dispatch(getCurrent())
    }
      else toast.error(response.mes)
   
    }
    if (flag === 'WISHLIST'){
      if (!current) return Swal.fire({
        title: 'Almost...',
        text: "Please login first!",
        icon: "info",
        showCancelButton: true,
        cancelButtonText: 'Not now!',
        confirmButtonText: "Go login page"
      }).then((rs) => {
        if (rs.isConfirmed) navigate({
          pathname: `/${path.LOGIN}`,
          search: createSearchParams({ redirect: location.pathname }).toString()
        })
      })
      const response = await apiUpdateWithlist({pid: productData._id}) 
      if (response.success){
        console.log(response)
        dispatch(getCurrent())
        toast.success(response.mes)
      }else toast.error(response.mes)

    }
  }
 
  return (
    <div className=' relative w-full text-base px-[10px] mb-4'>
      <div
       
        onMouseEnter={(el) => {
          el.stopPropagation()
          setIsShowOption(true)
        }}
        onMouseLeave={(el) => {
          el.stopPropagation()
          setIsShowOption(false)
        }}
        className='w-full border p-[15px] flex flex-col items-center shadow-lg rounded-xl my-3'
      >
        {isShowOption && <ul className='rounded-xl mx-3 pt-2  top-0 bottom-0 left-0 right-0 absolute z-10 bg-slate-300'>
          {productData?.description?.map(el => (<li className=' leading-6 ml-[20px]' key={el}>{el}</li>))}
        </ul>}
        <div className='w-full relative '>
          {isShowOption && <div className='absolute z-20 bottom-[-10px] left-0 right-0 flex justify-center animate__animated animate__fadeInUp gap-2'>
            <Link to={`http://localhost:3000/${productData?.category?.toLowerCase()}/${productData?._id}/${productData?.title}`}><SelectOption icon={<AiFillEye />} /></Link>
            {current?.cart?.some(el => el.product === productData._id) ? <span onClick={(e) => handleClickOptions("CART")}><SelectOption icon={<FaCartPlus />} /></span>
              : <span onClick={() => handleClickOptions("CART")}><SelectOption icon={<FaCartPlus color={blue}/>} /></span>}
            <span onClick={() => handleClickOptions("WISHLIST")}><SelectOption icon={<FaHeart color={current?.wishlist?.some((i) => i._id === productData.pid) ? 'red' : "gray"}/>} /></span> 
          </div>}
          <img
            src={productData?.thumb || "https://th.bing.com/th/id/OIP.CaLENRpDWR6DvqXLUqlrJgAAAA?rs=1&pid=ImgDetMain"}
            alt=""
            className='w-243px h-243px object-cover'
          />
          {!normal && (isNew === 1 ?
            <div className='w-[100px] h-[10px] absolute bg-red left-[0px] top-[-10px] text-red-600 font-extrabold'>
              <p>HOT</p>
            </div> : <div className='w-[100px] h-[10px] absolute bg-red left-[0px] top-[-10px] text-red-600 font-extrabold'>
              <p>NEW</p>
            </div>
          )}

        </div>
        <div className=' flex flex-col gap-2 mt-[15px] items-start w-full'>

          <span className='flex h-4'>
            {renderStarFromNumber(productData?.totalRatings)?.map((el, index) => (
              <span key={index}>{el}</span>
            ))}
          </span>
          <span className='truncate w-[95%]'>{productData?.title}</span>
          <span>{`${formatMoney(productData?.price)} VNĐ`}</span>
        </div>
      </div>
    </div>

  )
}

export default WithRase(memo(Product))