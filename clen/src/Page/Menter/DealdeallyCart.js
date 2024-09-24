import {  Button, OrderItem } from 'Comporen/Index'
import WithRase from 'hocs/withRase'
import React, { memo } from 'react'
import { useSelector } from 'react-redux'
import { createSearchParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { formatMoney } from 'Ultils/Hellpers'
import path from 'Ultils/Path'

const DealdeallyCart = ({  location, navigate }) => {

  const { currentCart, current } = useSelector(state => state.user)
  // const { category } = useParams()
  // const handleChangeQuantites = (pid, quantity, color) => {
  //   dispatch(updateCart({ pid, quantity, color }))
  // }
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
    else if (effectiveCart.length === 0 ){
      return Swal.fire({
        icon: "info",
        title: 'Almost!',
        text: "Please update your cart.",
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: "Go update",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate({
            pathname: `/`,
          })
        }
      })
  }
    else {
      window.open(`/${path.CHECKOUT}`, '_blank')
    }
  }
  return (
    <div className='w-full'>
      <div className='h-[81px] flex justify-center items-center bg-gray-100'>
        <div className='w-main'>
          <h3 className='text-3xl font-bold tracking-tight my-4'>My Cart</h3>
        </div>
      </div>
      <div>
        <div className='w-main mx-auto mt-8 border py-3  font-bold grid grid-cols-10  opacity-70'>
          <span className='col-span-6 w-full ml-1'>Products</span>
          <span className='col-span-1 w-full'>Quantity</span>
          <span className='col-span-3 w-full'>Price</span>
        </div>
        {effectiveCart?.map(el => (
          <OrderItem
            
            key={el._id}
            el={el}
            defaultQuantity={el.quantity}
          />
        ))}
      </div>
      <div className=' flex flex-col   mb-12 mt-3 gap-4 w-main mx-auto'>
        <span className='flex items-center justify-end gap-4 text-xl font-normal'>
          <span>Subtotal:</span>
          <span>{`${formatMoney(effectiveCart?.reduce((sum, el) => (+el?.price * +el?.quantity) + sum, 0))} VND`}</span>
        </span>
        <span className='text-xs italic flex justify-end'>Shipping,taxes, and discounts calculated at checkout</span>
        <span className='flex justify-end'><Button handleOnclick={() => handleSubmit()}>checkout</Button></span>
        {/* <Link className='bg-main text-white px-4 py-2 rounded-md' to={`/${path.CHECKOUT}`}>
          checkout
        </Link> */}
      </div>
    </div>
  )
}

export default WithRase(memo(DealdeallyCart))
