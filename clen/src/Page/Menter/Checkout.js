import { Congrat, InputFrom, Paypal } from 'Comporen/Index'
import WithRase from 'hocs/withRase'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getCurrent } from 'St/User/AsyncAction'
import { formatMoney } from 'Ultils/Hellpers'

const Checkout = ({ dispatch }) => {
  const { currentCart, current } = useSelector(state => state.user)
  let effectiveCart = currentCart;
  if (effectiveCart.length === 0) {
    effectiveCart = current.cart
  }
  const [isSuccess, setIsSuccess] = useState(false)
  useEffect(() => {
    if (isSuccess) dispatch(getCurrent())
  }, [isSuccess])
  const [selectedProducts, setSelectedProducts] = useState([]);
  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };
  const totalAmount = effectiveCart
    .filter(el => selectedProducts.includes(el._id))
    .reduce((sum, el) => (+el.price * +el.quantity) + sum, 0);
  console.log(formatMoney(Math.round((+totalAmount) / 24580)))
  return (
    <div className='w-full overflow-y-auto p-8 grip gap-6 '>
      {isSuccess && < Congrat />}
      <div className=' flex flex-col '>
        <h2 className='text-2xl font-bold'>Checkout your order</h2>
        <div className='w-full flex flex-col mx-auto  gap-6 items-center   justify-center'>
          <table className='w-main'>
            <thead>
              <tr className='border bg-gray-200 p-2'>
                <th className='p-2 text-center'>Products</th>
                <th className='p-2 text-center'>Quantity</th>
                <th className='p-2 text-center'>Price</th>
                <th className='p-2 text-center'>Chọn sản phẩm checkout</th>
              </tr>
            </thead>
            <tbody>
              {effectiveCart?.map(el => (<tr className='border' key={el._id}>
                <td className='flex'>
                  <img src={el.thumb} alt="" className='object-cover w-10 h-10' />

                  <p><span>{el.title}</span><span>{el.color}</span></p>

                </td>
                <td className='text-center'>{el.quantity}</td>
                <td className='text-center'>{formatMoney(el.price) + 'VND'}</td>
                <td className='text-center'>
                  <input
                    checked={selectedProducts.includes(el._id)}
                    onChange={() => handleSelectProduct(el._id)}
                    type='checkbox' />
                </td>
              </tr>))}
            </tbody>
          </table>
        </div>
      </div>
      <div className='w-full mt-[20px]'>
        <div className='w-main mx-auto'>
          <span className='flex items-start gap-8 text-xl'>
            <span>Address:</span>
            <span>{current?.address}</span>
          </span>
          <span className='flex items-start gap-8 text-xl'>
            <span>Phone:</span>
            <span>{current?.mobile}</span>
          </span>
          <span className='flex items-start gap-4 text-xl font-normal'>
            <span>Subtotal:</span>
            <span>{`${formatMoney(totalAmount)} VND`}</span>
          </span>
        </div>
        {selectedProducts.length > 0 && <Paypal
          payload={{
            products: effectiveCart,
            total: (Math.round((+totalAmount)) / 24580),
            address: current?.address
          }}
          setIsSuccess={setIsSuccess}
          amount={(Math.round((+totalAmount) / 24580))} />}
      </div>


    </div>
  )
}

export default WithRase(Checkout)