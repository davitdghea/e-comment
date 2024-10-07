import { Congrat, Paypal } from 'Comporen/Index'
import WithRase from 'hocs/withRase'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getCurrent } from 'St/User/AsyncAction'
import { formatMoney } from 'Ultils/Hellpers'

const Checkout = ({ dispatch }) => {
  const { current } = useSelector(state => state.user)
  const value = localStorage.getItem('selectedProductDetails');
  const selectedProductDetailsArray = value ? JSON.parse(value) : [];
  const [isSuccess, setIsSuccess] = useState(false)
  useEffect(() => {
    if (isSuccess) dispatch(getCurrent())
  }, [isSuccess, dispatch])

  const sum = selectedProductDetailsArray.reduce((acc, el) => acc + el.price * el.quantity, 0);
  const amount = (Math.round(+sum / 25350))
  return (
    <div className='w-full overflow-y-auto sm:p-8 grip gap-6 '>
      {isSuccess && < Congrat />}
      <div className=' flex flex-col '>
        <h2 className='sm:ml-[150px] text-2xl font-bold py-5 sm:py-0'>Checkout your order</h2>
        <div className='w-full mt-[20px] flex flex-col items-center justify-center'>
          <table className='w-full max-w-2xl table-auto'>
            <thead>
              <tr className='border bg-gray-200 p-2'>
                <th className='p-3 text-center'>Products</th>
                <th className='p-4 text-center'>Quantity</th>
                <th className='p-5 text-center'>Price</th>
              </tr>
            </thead>
            <tbody>
              {selectedProductDetailsArray?.map(el => (<tr className='border' key={el._id}>
                <td className='p-3 flex items-center'>
                  <img src={el.thumb} title={el.title +','+ el.color } alt="" className='object-cover w-10 h-10' />
                  <p className='text-sm ml-[10px]'><span>{el.title}</span> - <span className='italic'>{el.color}</span></p>
                </td>
                <td className='p-4 text-center'>{el.quantity}</td>
                <td className='p-5 text-center' >{formatMoney(el.price * el.quantity) + 'VND'}</td>              
              </tr>))}
            </tbody>
          </table>
        </div>
      </div>
      <div className='w-full max-w-[672px] mx-auto mt-[20px] flex flex-col '>
        <div className='flex flex-col mt-6 gap-4'>
          <span className='text-xl'><strong>Address:</strong> {current?.address}</span>
          <span className='text-xl'><strong>Phone:</strong> {current?.mobile}</span>
          <span className='text-xl font-bold'><strong>Subtotal:</strong> {formatMoney(+sum)} VND</span>
        </div>
       
        <div className='flex justify-center mt-8 w-full'>
          <Paypal
            payload={{ products: selectedProductDetailsArray, total: +sum, address: current?.address }}
            amount={+amount}
            setIsSuccess={setIsSuccess}
          />
        </div>
      </div>


    </div>
  )
}

export default WithRase(Checkout)