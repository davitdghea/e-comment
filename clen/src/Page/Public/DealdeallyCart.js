import { Breadcrumb, Button, OrderItem, SelectQuantity } from 'Comporen/Index'
import React, { memo } from 'react'
import { useSelector } from 'react-redux'
import { createSearchParams, useParams } from 'react-router-dom'
import { updateCart } from 'St/User/Userslice'
import Swal from 'sweetalert2'
import { formatMoney } from 'Ultils/Hellpers'
import path from 'Ultils/Path'

const DealdeallyCart = ({ dispatch, location, navigate }) => {
  
  const { currentCart, current } = useSelector(state => state.user)
  const { category } = useParams()
  const handleChangeQuantites = (pid, quantity, color) =>{
    dispatch(updateCart({ pid, quantity, color }))
  }
  const handleSubmit = () =>{
    if(!current?.address) return Swal.fire({
      icon:"info",
      title: 'Almost!',
      text:"Please update your address before checkout.",
      showCancelButton: true,
      showConfirmButton:true,
      confirmButtonText:"Go update",
      cancelButtonText:"Cancel"
    }).then((result) => {
      if (result.isConfiread) navigate({
        pathname:`/${path.MEMBER}/${path.PERSONAL}`,
        search: createSearchParams({redirect:location.pathname}).toString()
      })
    })
    else{
      window.open(`/${path.CHECKOUT}`,'_blank')
    }
  }
  return (
    <div className='w-full'>
      <div className='h-[81px] flex justify-center items-center bg-gray-100'>
        <div className='w-main'>
          <Breadcrumb category={category} />      
        </div>

      </div>
      <div>
        <div className='w-main mx-auto my-8  py-3  font-bold grid grid-cols-10  opacity-70'>
          <h3 className='text-3xl font-bold tracking-tight my-4'>My Cart</h3>
        </div>
        
        <div className='w-main mx-auto my-8 border py-3  font-bold grid grid-cols-10  opacity-70'>
          <span className='col-span-6 w-full ml-1'>Products</span>
          <span className='col-span-1 w-full'>Quantity</span>
          <span className='col-span-3 w-full'>Price</span>
        </div>
        {currentCart?.cart?.map(el => (
          <OrderItem
          handleChangeQuantites={handleChangeQuantites}
          key={el._id}
          el={el}
            defaultQuantity={el.quantity}
          />
        ))}
      </div>
      <div className='w-main mx-auto flex flex-col justify-center items-center mb-12 mt-3 gap-4'>
        <span className='flex items-center gap-4 text-xl font-normal'>
          <span>Subtotal:</span>
          <span>{`${formatMoney(currentCart?.cart?.reduce((sum, el) => (+el?.price * +el?.quantity) + sum, 0))} VND`}</span>
        </span>
        <span className='text-xs italic '>Shipping,taxes, and discounts calculated at checkout</span>
        <Button handleOnclick={handleSubmit()}>checkout</Button>
        {/* <Link className='bg-main text-white px-4 py-2 rounded-md' to={`/${path.CHECKOUT}`}>
          checkout
        </Link> */}
      </div>
    </div> 
  )
}

export default memo(DealdeallyCart)
