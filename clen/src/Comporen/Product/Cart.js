import React, { memo } from 'react'
import { AiFillCloseCircle } from 'react-icons/ai'
import WithRase from 'hocs/withRase'
import { ShowCart } from 'St/App/Appslice'
import { useSelector } from 'react-redux'
import { formatMoney } from 'Ultils/Hellpers'
import { Button } from 'Comporen/Index'
import { IoMdBusiness } from 'react-icons/io'
import { apiRemoteCart } from 'Apis/User'
import { getCurrent } from 'St/User/AsyncAction'
import { toast } from 'react-toastify'
import path from 'Ultils/Path'
const Cart = ({ dispatch, navigate }) => {
  const { current } = useSelector(state => state.user)
  console.log(current?.cart)
  const RemoteCart = async (pid, color) => {
    const response = await apiRemoteCart(pid, color)
    if (response.success) {
      toast.success(response.mes)
      dispatch(getCurrent())
    }
    else toast.error(response.mes)
  }
  return (
    <div onClick={e => { e.stopPropagation() }} className='grid grid-rows-10 w-[400px] h-screen bg-black text-white float-end animate__animated animate__fadeInRight'>
      <header className=' border-b row-span-1  border-gray-500 flex justify-between font-bold text-2xl items-center pl-2 pb-4'>
        <span>Your cart</span>
        <span onClick={() => dispatch(ShowCart())}><AiFillCloseCircle size={24} className='p-2 cursor-pointer' /></span>
      </header>
      <section className='flex-col row-span-7 mt-5 gap-3 overflow-y-auto py-3'>
        {!current?.cart && <span className='text-xs italic'> Your cart is empty</span>}
        {current?.cart && current?.cart?.map(el => (
          <div key={el._id} className='flex justify-between mt-3 pb-3 border-b-2 border-b-slate-300  '>
            <div className='flex gap-2 '>
              <img src={el?.thumb} alt='thumb' className='w-24 h-25 object-cover mx-2'></img>
              <div className='flex flex-col gap-1'>
                <span className='text-bold'>Title: {el.title}</span>
                {el.color && <span className='text-bold'>Color: {el.color}</span>}
                <span className='text-bold'>Price: {formatMoney(+el.price * +el.quantity)} VNĐ</span>
                <span className='text-bold'>Quantity: {el.quantity}</span>
              </div>
            </div>
            <span onClick={() => RemoteCart(el.product,el.color)} className='h-8 rounded-full flex  justify-center hover:bg-gray-200 cursor-pointer mr-2'><IoMdBusiness size={20} /></span>
          </div>
        ))}
      </section>
      <div className=' row-span-2 h-full gap-3 flex flex-col'>
        <div>
          <span className='pl-2'>Subtotal: </span>
          <span>{formatMoney(current?.cart?.reduce((sum, el) => sum + (el.price * el.quantity), 0))} VNĐ</span>
        </div>
        <span className='text-center text-gray-500'>
          Shipping, taxes, and discounts calculated at checkout
        </span>
        <Button handleOnclick={() => {navigate(`/${path.MEMBER}/${path.DETALL_CART}`);dispatch(ShowCart())}} style='rounded-none w-full bg-main py-3'>
          Shopping Cart
        </Button>
        <Button handleOnclick={() => navigate(`/${path.DETALL_CART}`)} style='rounded-none w-full bg-main py-3'>
          Thanh toán
        </Button>
      </div>
    </div>
  )
}

export default WithRase(memo(Cart))