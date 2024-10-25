import { apiCreateOrder } from 'Apis/Products'
import { apiUpdateMoney } from 'Apis/User'
import { Congrat, Paypal } from 'Comporen/Index'
import WithRase from 'hocs/withRase'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { createSearchParams } from 'react-router-dom'
import { getCurrent } from 'St/User/AsyncAction'
import Swal from 'sweetalert2'
import 'animate.css'
import { formatMoney } from 'Ultils/Hellpers'
import path from 'Ultils/Path'

const Checkout = ({ dispatch, navigate, location }) => {
  const { current } = useSelector(state => state.user)
  const value = localStorage.getItem('selectedProductDetails');
  const selectedProductDetailsArray = value ? JSON.parse(value) : [];
  const [isSuccess, setIsSuccess] = useState(false)
  const [checkout, setCheckout] = useState(false)
  useEffect(() => {
    if (isSuccess) dispatch(getCurrent())
  }, [isSuccess, dispatch])
  const moneyvi = current.money
  const sum = selectedProductDetailsArray.reduce((acc, el) => acc + el.price * el.quantity, 0);
  const amount = (Math.round(+sum / 25350))
  const thanhtoan = async() =>{
    try {
      if (moneyvi - sum < 0) return Swal.fire({
        icon: "info",
        title: 'Almost!',
        text: "Vui lòng nạp thêm tiền vào tài khoản để thanh toán.",
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: "Go update",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate({
            pathname: `/${path.MEMBER}/${path.WALLET}`,
            search: createSearchParams({ redirect: location?.pathname }).toString()
          })
        }
      })
      else
      {const respse = await apiUpdateMoney({ rut: sum })
      const response = await apiCreateOrder({ products: selectedProductDetailsArray, total: +sum, address: current?.address, status: "Order" });
      if (respse.success && response.success) {
        setIsSuccess(true);
        Swal.fire('Chúc mừng!', 'Đơn hàng đã được tạo.', 'success').then(() => {
          navigate('/');
        });
      }}
    } catch (error) {
      console.error("Error creating order:", error);
    }
  }
  
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
       <div>
        <button className='w-full bg-blue-500 rounded-lg py-2 flex mt-4 text-white justify-center' onClick={() => setCheckout(true)}>
            <span>Chọn hình tức thanh toán </span>  
           
        </button>
       </div>
        {checkout && (+amount >= 1 ? <div onClick={() => setCheckout(false)} className='absolute top-0 bottom-0 bg-overlay left-0 right-0 flex  justify-center items-end mt-8 w-full'>
          <div onClick={e => e.stopPropagation()} className='bg-white animate__animated animate__fadeInUp  w-full max-w-[672px]   '>
            <div className=' w-full max-w-[95%] mx-auto bg-blue-500 rounded-[5px] py-4 flex my-4 text-white  flex-col'>
              <span onClick={() => thanhtoan()} className='text-center text-[18px]'>Thanh toán bằng ví ứng dụng</span>
              {moneyvi - sum < 0 && <span className='text-red-500'>Số tiền trong ví không đủ</span>}
            </div>
            <div className='w-full max-w-[95%] mx-auto'>
              <Paypal
                payload={{ products: selectedProductDetailsArray, total: +sum, address: current?.address }}
                amount={+amount}
                setIsSuccess={setIsSuccess}
              />
            </div>
            
          </div>
            </div> : <div className='mt-8'><p className=' italic text-red-500'>Chỉ thanh toán đối với đơn lớn hơn 50.000</p></div>)}
      </div>


    </div>
  )
}

export default WithRase(Checkout)