import { Congrat, InputFrom, Paypal } from 'Comporen/Index'
import WithRase from 'hocs/withRase'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getCurrent } from 'St/User/AsyncAction'
import { formatMoney } from 'Ultils/Hellpers'

const Checkout = ({dispatch,navigate}) => {
  const {currentCart,current } = useSelector(state => state.user)
  const [isSuccess,setIsSuccess] = useState(false)
 useEffect(()=>{
   if (isSuccess) dispatch(getCurrent())
 
 }, [isSuccess])
  return (
    <div className='w-full overflow-y-auto p-8 grip grip-cols-10 gap-6 '>
      {isSuccess && < Congrat/>}
      <div className='w-full flex justify-center items-center col-span-4'>

      </div>
      <div className=' flex flex-col col-span-6'>
        <h2 className='text-2xl font-bold'>Checkout your order</h2>
        <div className='flex w-full gap-6 items-center justify-between'>
          <table className='table-auto flex w-full flex-1'>
            <thead>
              <tr className='border bg-gray-200 p-2'>
                <th className='p-2 text-center'>Products</th>
                <th className='p-2 text-center'>Quantity</th>
                <th className='p-2 text-center'>Price</th>
              </tr>
            </thead>
            <tbody>
              {currentCart?.map(el => (<tr className='border' key={el._id}>
                <td>{el.title}</td>
                <td>{el.quantity}</td>
                <td>{formatMoney(el.price) + 'VND'}</td>
              </tr>))}
            </tbody>
          </table>
          <div className='flex-1'>
            <span className='flex items-center gap-8 text-sm'>
              <span>Address:</span>
              <span>{current?.address}</span>
            </span>
            <span className='flex items-center gap-4 text-xl font-normal'>
              <span>Subtotal:</span>
              <span>{`${formatMoney(currentCart?.cart?.reduce((sum, el) => (+el?.price * +el?.quantity) + sum, 0))} VND`}</span>
            </span>
          </div>
        </div>
      </div>
      {<div className='w-full mx-auto'>
        <Paypal 
          payload={{ 
            products: currentCart,
             total: Math.round(+currentCart?.cart?.reduce((sum, el) => (+el?.price * +el?.quantity) + sum, 0) / 24.580),            
            address:current?.addrenss
           }} 
          setIsSuccess={setIsSuccess}
          amount={Math.round(+currentCart?.cart?.reduce((sum, el) => (+el?.price * +el?.quantity) + sum, 0) / 24.580)} />
      </div>

      }
    </div>
  )
}

export default WithRase(Checkout)