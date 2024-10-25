import {  Button, OrderItem } from 'Comporen/Index'
import WithRase from 'hocs/withRase'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { createSearchParams } from 'react-router-dom'
import { getCurrent } from 'St/User/AsyncAction'
import Swal from 'sweetalert2'
import { formatMoney } from 'Ultils/Hellpers'
import path from 'Ultils/Path'

const DealdeallyCart = ({ location, navigate, dispatch }) => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const handCallBack = useCallback((id)=>{
    setSelectedProducts(id)
  })
  useEffect(() => {
    dispatch(getCurrent())
  }, [dispatch])
  const { currentCart, current } = useSelector(state => state.user)
  let effectiveCart = currentCart;
  if (effectiveCart.length === 0) {
    effectiveCart = current.cart
  }
  const handleSubmit = () => {
    if (!current?.address || !current?.mobile) return Swal.fire({
      icon: "info",
      title: 'Almost!',
      text: "Please update your address or phone before checkout.",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Go update",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate({
          pathname: `/${path.MEMBER}/${path.PERSONAL}`,
          search: createSearchParams({ redirect: location?.pathname }).toString()
        })
      }
    })
    else if (selectedProducts.length === 0 ){
      return Swal.fire({
        icon: "info",
        title: 'Almost!',
        text: "Please select payment product.",
        showConfirmButton: true,
        confirmButtonText: "OK",
      })
  }
    else {
      localStorage.setItem('selectedProductDetails', JSON.stringify(selectedProductDetails));
      window.open(`/${path.CHECKOUT}`, '_blank')
    }
  }
 
  const selectedProductDetails = effectiveCart.filter(product => selectedProducts.includes(product._id));
  return (
    <div className='max-w-[1100px] mx-auto w-full '>
      <div className='h-[70px] flex  items-center bg-gray-100 sm:relative fixed top-0 left-0 right-0'>
          <h3 className='text-3xl font-bold tracking-tight  ml-[55px] sm:ml-2'>My Cart</h3>
      </div>
      <div className='sm:mt-[50px] mt-[100px]'>
        <div className='w-full  mt-8 border py-3  font-bold grid grid-cols-10  opacity-70'>
          <span className='sm:col-span-5 col-span-4 w-full ml-1 text-[12px] sm:text-[20px]'>Products</span>
          <span className='col-span-2 sm:col-span-1 w-full text-[12px] sm:text-[20px]'>Quantity</span>
          <span className='col-span-3 w-full text-[12px] sm:text-[20px]'>Price</span>
          <span className='col-span-1 w-full text-[12px] sm:text-[20px]'>Paypal</span>
        </div>
        {effectiveCart?.map(el => (
          <OrderItem 
            selectedProducts={selectedProducts}
            handCallBack={handCallBack}           
            key={el._id}
            el={el}
            defaultQuantity={el.quantity}
          />
        ))}
      </div>
      <div className=' flex flex-col  mb-12 mt-3 gap-4 w-full '>
        <span className='flex justify-end mr-1 items-center gap-4 text-xl font-normal'>
          <span>Subtotal:</span>
          <span>{`${formatMoney(selectedProductDetails?.reduce((sum, el) => (+el?.price * +el?.quantity) + sum, 0))} VND`}</span>
        </span>
        <span className='text-xs justify-end mr-1 italic flex '>Shipping,taxes, and discounts calculated at checkout</span>
        <span className='flex justify-end mr-1'><Button handleOnclick={() => handleSubmit()}>checkout</Button></span>       
      </div>
    </div>
  )
}

export default WithRase(memo(DealdeallyCart))
