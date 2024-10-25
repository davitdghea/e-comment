import { apiPayouts } from 'Apis/User'
import { Paypal } from 'Comporen/Index'
import WithRase from 'hocs/withRase'
import React, { memo, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { getCurrent } from 'St/User/AsyncAction'
import { format } from 'date-fns';
import Swal from 'sweetalert2'
import 'animate.css'
import { formatMoney } from 'Ultils/Hellpers'
const Wallet = ({dispatch}) => {
    const [moneynap,setMoneynap] = useState(0)
    const { current } = useSelector(state => state.user)
    const amount = (Math.round(+moneynap / 25350))
    const [isSuccess, setIsSuccess] = useState(false)
    const[ruttien,setRuttien]=useState(false)
  const [nap,setNap] = useState(false)
  const [moneyrut, setMoneyrut] = useState(null)
  const [naptien, setNaptien] = useState(false)
  const [tkrap, setTkrap] = useState(null)
    useEffect(() => {
        dispatch(getCurrent())
    }, [isSuccess, dispatch])
  const payouts = async (emailPayPal, amount, money) =>{
    if (moneyrut > current.money){
      toast.error("số tiền rút vượt qua tiền trong ví")
      return;
    }
    if (moneyrut < 50000) {
      toast.error("số tiền rút tối thiểu 50.000")
      return;
    }
    function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
    if (!isValidEmail(tkrap)){
      toast.error("nhập tài khoản email nhận tiền ")
      return;
    }
      const response = await apiPayouts(emailPayPal, amount, money)
    if (response.success)
      setIsSuccess(!isSuccess)
      Swal.fire('Rút tiền thành công!', 'Vui lòng check tài khoản paypal của bạn.', 'success')
  }
  return (
      <div className='w-full relative'>
        <div className='w-full bg-slate-400'>
          <header className='flex items-center fixed top-0 z-30 w-full bg-gray-100 text-3xl font-semibold h-[70px] border-b-2 pl-2 '>
                  <p className='ml-[50px] sm:ml-0'>Wallet</p>
          </header>
      </div>
      <div className='relative mt-[50px]'>
          <div className='bg-orange-500 min-h-[200px] text-white text-[25px] font-extrabold flex justify-center items-center'>
          <span>Money: {formatMoney(Math.round(current.money))}</span>
          </div>
          <div>
          <div className='absolute left-1/2 transform -translate-x-1/2  mx-auto flex justify-around top-[170px] px-3 py-4 bg-[#ADD8E6] w-[200px]'>     
            <span className='font-medium text-white cursor-pointer' onClick={() => setNaptien(!naptien)} >Nạp</span>
            <span className='font-medium text-white cursor-pointer' onClick={() => setRuttien(!ruttien)} >Rút</span>
            </div>
            <div className='mt-[50px]'>
            <div className=' justify-between flex border-b-2 border-b-gray-300 py-2 '>
               <span className='ml-5'>Lịch sử giao dịch</span>
              </div> 
            </div>
            <div className=''>
            {current.history.slice().reverse().map(el => (
              <div className='flex justify-around py-2 border-b-2 border-gray-300'>
                {el.rut && <span> - {formatMoney(Math.round(+el.rut))} </span>}
                {el.nap && <span> + {formatMoney(Math.round(+el.nap))}</span>}
                <span>{format(new Date(el.time), 'dd/MM/yyyy HH:mm:ss')}</span>
              </div>
            )) }
            </div>
          {naptien && <div onClick={(e) => { setNaptien(!naptien); e.stopPropagation(); setNap(false); setMoneynap(0) }} className='bg-overlay  absolute flex min-h-screen justify-center  top-0 bottom-0 right-0 left-0'>
            <div onClick={(e) => e.stopPropagation()} className='bg-white relative p-5 rounded-md  h-full max-h-[400px] mt-[200px] w-full max-w-[600px]'>
              <h1 className='text-center text-[20px] font-extrabold'>Nạp tiền</h1>
              <div className='flex flex-col mt-5'>
                <img className='h-full max-h-[150px]' src="https://res-console.cloudinary.com/dpdta6mey/thumbnails/v1/image/upload/v1729828642/Y2FzaGJhY2staWNvbi13aXRoLXdhbGxldC1jYXNoYmFjay1tb25leS1iYWNrLWxhYmVsXzM0ODItMTE3OTItcmVtb3ZlYmctcHJldmlld193YW51bmg=/drilldown" />
                <span>Nhập số tiền:</span>
                <input className='outline-none mt-2 border-2 border-gray-400 py-3 pl-2 rounded-md' onChange={(el) => setMoneynap(el.target.value)} placeholder='Nhập tối thiểu 50000' />
              </div> 

              {+amount >= 1 ? 
                <div onClick={() => setNap(true)} className='cursor-pointer w-full mt-5 flex py-2 rounded-md justify-center items-center bg-blue-500'>
                  <span  className='text-white'> Xác nhận </span>
              </div>
               : <div className='mt-2'>
                <p className=' italic text-red-500'>Chỉ thanh toán đối với đơn lớn hơn 50.000</p></div>}
              </div>
            {nap && <div className='animate__animated animate__fadeInUp absolute top-0 bottom-0 flex justify-center items-end left-0 right-0 bg-overlay'>
              <div className=' flex justify-center pt-8 w-full bg-white bottom-0 max-w-[600px] mx-auto'>
              <div className='w-full max-w-[95%]'>
                  <Paypal
                    payload={{ total: (+moneynap * 100), uid: current._id }}
                    amount={+amount}
                    isSuccess={isSuccess}
                    setIsSuccess={setIsSuccess}
                  />
              </div>
            </div></div>}
            </div>}
          {ruttien && <div onClick={() => setRuttien(!ruttien)} className='bg-overlay  absolute flex min-h-screen justify-center  top-0 bottom-0 right-0 left-0'>
            <div onClick={(e) => e.stopPropagation()} className='bg-white p-5   rounded-md  h-full max-h-[480px] mt-[150px] w-full max-w-[600px]'>
              <h1 className='text-center text-[20px] font-extrabold'>Rút tiền</h1>
              <div className='flex flex-col justify-center'>
                <img className='h-full max-h-[150px]' src="https://res-console.cloudinary.com/dpdta6mey/thumbnails/v1/image/upload/v1729828642/Y2FzaGJhY2staWNvbi13aXRoLXdhbGxldC1jYXNoYmFjay1tb25leS1iYWNrLWxhYmVsXzM0ODItMTE3OTItcmVtb3ZlYmctcHJldmlld193YW51bmg=/drilldown"/>
                <span className='my-2'>Nhập số tiền:</span>
                <input className='outline-none border-2 border-gray-400 px-2 py-3' onChange={(el) => setMoneyrut(el.target.value)} placeholder='Nhập tối thiểu 50000' />
              </div>
              <div className='flex flex-col'>
                <span className='my-2'>Nhập tài khoản Paypal:</span>
                <input className='outline-none border-2 border-gray-400 px-2 py-3' type='email' onChange={(el) => setTkrap(el.target.value)} placeholder='Nhập  tài khoản nhận tiền' />
             </div>
              <button onClick={(tkrap && moneyrut) ? () => payouts({ emailPayPal: tkrap, amount: (moneyrut * 100), money: current.money }) : undefined} className={`${(tkrap && moneyrut) ? 'bg-blue-500 text-white ' : 'bg-gray-500 text-white'} p-2 mt-8 rounded-sm`}>Xác nhận rút tiền</button>    
            </div>
            </div>}
          </div>
      </div>
    </div>
  )
}

export default memo(WithRase(Wallet))