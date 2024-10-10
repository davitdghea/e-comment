import React, { memo, useState } from 'react'
import { formatMoney } from '../../Ultils/Hellpers'
import { renderStarFromNumber } from "../../Ultils/Hellpers"
import SelectOption from '../Search/SelectOption'
import icons from '../../Ultils/Icons'
import { createSearchParams, Link } from 'react-router-dom'
import 'animate.css'
import { apiRemoteCart, apiUpdateCart, apiUpdateWithlist } from 'Apis/User'
import {  useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { getCurrent } from 'St/User/AsyncAction'
import Swal from 'sweetalert2'
import path from 'Ultils/Path'
import WithRase from 'hocs/withRase'
import DOMPurify from 'dompurify'
import { FaCartArrowDown } from "react-icons/fa";

const { AiFillEye, FaCartPlus, FaHeart } = icons
const Product = ({ productData, isNew, normal, dispatch, navigate, location,pid }) => {
 const {current} = useSelector(state => state.user)  
  const [isShowOption, setIsShowOption] = useState(false)
  const handleClickOptions = async (flag) =>{
    if(flag === 'REMOTECART'){
      const pid = productData._id
      const color = productData.color
      const response = await apiRemoteCart(pid,color)
      if (response.success) {
        console.log("Current:", current);
        console.log("cart:", current?.cart);
        console.log(current?.cart?.some(el => el.product === productData._id))
        toast.success(response.MessageChannel)
        dispatch(getCurrent())
      }
      else toast.error(response.MessageChannel)

    }
    if (flag === 'DElTAL'){
      navigate({
        pathname: `/${productData?.category.toLowerCase()}/${productData?._id}/${productData?.title}`
      })
    }
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
        title: productData.title,
      })
      
    if(response.success) {
      toast.success(response.MessageChannel)
      dispatch(getCurrent())
    }
    else toast.error(response.MessageChannel)
   
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
      console.log(response)
      if (response.success){
       
        dispatch(getCurrent())
        toast.success(response.rs)
      } else toast.error(response.rs)

    }
  }
  //Link to={`${category}/${productData?._id}/${productData?.title}`}>;
  return (
    <div onClick={() => handleClickOptions("DElTAL")} className=' cursor-pointer relative w-full text-base mx-[1] px-[2px] sm:px-[10px] mb-4'>
      <div      
        onMouseEnter={(el) => {
          el.stopPropagation()
          setIsShowOption(true)
        }}
        onMouseLeave={(el) => {
          el.stopPropagation()
          setIsShowOption(false)
        }}
        className='w-full border sm:p-[15px] p-[10px] flex flex-col items-center shadow-lg rounded-xl my-3'
      >
        
        <div className='w-full relative '>
          {isShowOption && <div className='absolute z-20 bottom-[-10px] left-0 right-0 flex justify-center animate__animated animate__fadeInUp gap-2'>
            {current?.cart?.some(el => el.product === productData._id) ? <span onClick={(e) => {handleClickOptions("REMOTECART");e.stopPropagation()}}><SelectOption icon={<FaCartArrowDown />} /></span>
              : <span onClick={(e) => {handleClickOptions("CART");e.stopPropagation()}}><SelectOption icon={<FaCartPlus color={'blue'}/>} /></span>}
            <span onClick={(e) => {handleClickOptions("WISHLIST");e.stopPropagation()}}><SelectOption icon={<FaHeart color={current?.wishList?.some((i) => i._id === productData._id) ? 'red' : "gray"}/>} /></span> 
          </div>}
          <img
            src={productData?.thumb || "https://th.bing.com/th/id/OIP.CaLENRpDWR6DvqXLUqlrJgAAAA?rs=1&pid=ImgDetMain"}
            alt=""
            className='w-[243px] h-[243px] object-cover mx-auto'
          />
          {!normal && (isNew === 1 ?
            <div className='w-[100px] h-[10px] absolute bg-red left-[0px] top-[-10px] text-red-600 sm:font-extrabold font-extralight text-[12px] sm:text-[20px]'>
              <p>HOT</p>
            </div> : <div className='w-[100px] h-[10px] absolute bg-red left-[0px] top-[-10px] text-red-600 sm:font-extrabold font-extralight text-[12px] sm:text-[20px]'>
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
          <span className='truncate w-[95%]'>{`${formatMoney(productData?.price)} VNĐ`}</span>
        </div>
      </div>
    </div>

  )
}

export default WithRase(memo(Product))