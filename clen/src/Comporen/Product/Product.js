import React, { memo, useState } from 'react'
import { formatMoney } from '../../Ultils/Hellpers'
import { renderStarFromNumber } from "../../Ultils/Hellpers"
import SelectOption from '../Search/SelectOption'
import icons from '../../Ultils/Icons'
import { createSearchParams } from 'react-router-dom'
import 'animate.css'
import { apiRemoteCart, apiUpdateCart, apiUpdateWithlist } from 'Apis/User'
import {  useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { getCurrent } from 'St/User/AsyncAction'
import Swal from 'sweetalert2'
import path from 'Ultils/Path'
import WithRase from 'hocs/withRase'
import { FaCartArrowDown } from "react-icons/fa";

const { FaCartPlus, FaHeart } = icons
const Product = ({ productData, isNew, normal, dispatch, navigate, location, Style, pid }) => {
const {current} = useSelector(state => state.user)  
const [isShowOption, setIsShowOption] = useState(false)
  const handleClickOptions = async (flag) =>{
    if(flag === 'REMOTECART'){
      const pid = productData._id
      const color = productData.color
      const response = await apiRemoteCart(pid,color)
      if (response.success) {
        toast.success( "Đã xóa sản phẩm khỏi giỏ hàng!!!")
        dispatch(getCurrent())
      }
      else toast.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng!!!"); 

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
      toast.success(response.message)
      dispatch(getCurrent())
    }
    else toast.error(response.message)
   
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
      const response = await apiUpdateWithlist({ pid: productData._id, thumb: productData.thumb, title: productData.title, category: productData.category, price: productData.price, color: productData.color }) 
      
      if (response.success){
       
        dispatch(getCurrent())
        toast.success(response.rs)
      } else toast.error(response.rs)

    }
  }
 
  return (
    <div onClick={() => handleClickOptions("DElTAL")} className={Style}>
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
            <span onClick={(e) => {handleClickOptions("WISHLIST");e.stopPropagation()}}><SelectOption icon={<FaHeart color={current?.wishList?.some((i) => i.pid === productData._id) ? 'red' : "gray"}/>} /></span> 
          </div>}
          <img
            src={productData?.thumb || "https://th.bing.com/th/id/OIP.CaLENRpDWR6DvqXLUqlrJgAAAA?rs=1&pid=ImgDetMain"}
            alt=""
            className='w-[243px] h-[243px] object-cover mx-auto'
          />
          {!normal && (isNew === 1 ?
            <div className='w-[500px] h-[25px] flex justify-center absolute rounded-t-md rounded-bl-md left-[-15px] top-[-15px] bg-red-500 text-white sm:font-extrabold font-extralight text-[12px] sm:text-[15px]'>
              <p>NEW</p>
            </div> : <div className='w-[50px] flex justify-center h-[25px] rounded-t-md rounded-bl-md absolute bg-red-500 left-[-15px] top-[-15px] text-white sm:font-extrabold font-extralight text-[12px] sm:text-[15px]'>
              <p>HOT</p>
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