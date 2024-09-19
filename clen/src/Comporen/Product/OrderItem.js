import { SelectQuantity } from 'Comporen/Index'
import React, { useEffect, useState } from 'react'
import { updateCart } from 'St/User/Userslice'
import { formatMoney } from 'Ultils/Hellpers'

const OrderItem = ({ el, defaultQuantity = 1, dispatch }) => {
    const [quantity, setQuantity] = useState(() => defaultQuantity)  
    useEffect(()=>{
        setQuantity(el.quantity)
    },[el])
    const handleQuantity = (number) => {
        if (+number > 1) setQuantity(number)
    }
    const handleChanGeQuantity = (flag) => {
        if (flag === 'minus' && quantity === 1) return
        if (flag === 'minus') setQuantity(prev => +prev - 1)
        if (flag === 'plus') setQuantity(prev => +prev + 1)
    }
useEffect(()=>{
     dispatch(updateCart({pid:el.product?._id,quantity,color:el.color}))
},[quantity])
  return (
      <div key={el._id} className='w-main mx-auto font-bold  border-b py-3 grid grid-cols-10  '>
          <span className='col-span-6 w-full'>
              <div className='flex gap-2'>
                  <img src={el?.thumb} alt='thumb' className='w-16 h-16 object-cover'></img>
                  <div className='flex flex-col gap-1'>
                      <span className='text-main'>{el.title}</span>
                      <span className='text-xs'>{el.color}</span>
                  </div>
              </div >
          </span>
          <span className='col-span-1 w-full mt-[22px]'>
            {el.quantity}
              <div className='flex items-center justify-center mt-[22px]'>
                  <SelectQuantity
                      quantity={quantity}
                      handleQuantity={handleQuantity}
                      handleChanGeQuantity={handleChanGeQuantity}
                  />
              </div>
          </span>
          <span className='col-span-1 w-full h-full mt-5'>
              <span className='text-lg'>{formatMoney(el.price * quantity) + "VND"}</span>
          </span>
      </div>
  )
}

export default OrderItem