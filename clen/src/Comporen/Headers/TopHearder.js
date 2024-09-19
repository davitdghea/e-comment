import React, { useEffect, Fragment, useState, memo } from 'react'
import { Link } from 'react-router-dom'
import path from 'Ultils/Path'
import { getCurrent } from 'St/User/AsyncAction'
import {  useSelector } from 'react-redux'
import { clearMessage, logout } from 'St/User/Userslice'
import icons from 'Ultils/Icons'
import Swal from 'sweetalert2'
import WithRase from 'hocs/withRase'
import { ShowCart } from 'St/App/Appslice'
const { LuMenuSquare, IoIosSearch, BsPersonCircle, RiPhoneFill, BsHandbagFill, FaRegHeart } = icons
const TopHearder = ({ handleClickMenu, dispatch, navigate }) => {
  const [InformationUser, setInformationUser] = useState(false)
  const { isLoggedIn, current, mes } = useSelector(state => state.user)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isLoggedIn) dispatch(getCurrent());
    }, 300);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [dispatch, isLoggedIn]);
  useEffect(() => {
    if (mes) Swal.fire('Oops!', mes, 'info').then(() => {
      dispatch(clearMessage())
      navigate(`/${path.LOGIN}`)
    })
  }, [mes])

  const clearLocalStorage = () => {
    localStorage.clear()
  }
  return (
    <div className='h-[100px] w-full  bg-white fixed shadow-md z-40'>
      <div className='w-main flex items-center justify-between text-xs m-auto'>
        <div className='m-auto w-main flex justify-between h-[110px] py-[35px]'>
          
            <Link to='/' className='max-w-[340px] w-full'>
              <img className='w-full' src="https://digital-world-2.myshopify.com/cdn/shop/files/logo_digital_new_250x.png?v=1613166683" alt="logo" />
            </Link>
          
         
          <div className="flex text-[13px] ">
            <div onClick={()=>handleClickMenu(true)} className='flex items-center justify-center border-x p-2 cursor-pointer'>
              <span><LuMenuSquare size={24} className='mr-3' /></span>
              <span className='flex flex-col'><span>Danh</span><span>mục</span> </span>
            </div>
            <div className='cursor-pointer flex flex-col px-4 border-r items-center'>
              <span className='flex items-center'>
                <span className='bg-slate-300  p-3 rounded-l-md'><IoIosSearch color='red' size={15} /></span>
                <input placeholder='Bạn cần gì?' className=' w-[250px] outline-none p-3 rounded-r-md  flex  bg-slate-300 text-gray-100' />
              </span>
              <span></span>
            </div>
            <div className='flex flex-col px-4 border-r items-center'>
              <span className='flex items-center'>
                <RiPhoneFill color="red" />
                <span className='font-semibold ml-3 text-base'> (+1800) 000 8808</span>
              </span>
              <span>Online Support 24/7</span>
            </div>
            <div className='cursor-pointer flex items-center border-r justify-end '>
              <span className='mx-3'><FaRegHeart size={24} color='red' /></span>
            </div>
            <div onClick={() => dispatch(ShowCart())} className='cursor-pointer flex items-center justify-center  p-2  border-r mr-2'>
              <span className='flex relative items-center '>
                <BsHandbagFill color='red' size={25} />
                <span className=' absolute left-2.5  top-3'>{current?.cart?.length || 0}</span>
                <span className='flex flex-col ml-1'><span>Giỏ</span><span>hàng</span></span>
              </span>
            </div>
            {isLoggedIn && current ? (<div onClick={() => setInformationUser(!InformationUser)} className='rounded-sm flex flex-col justify-center items-center relative'>
                {current && <Fragment>
                    <div className='flex items-center cursor-pointer justify-center  flex-col'>
                      <BsPersonCircle size={25} />
                      <span>{`${current?.lastname} ${current?.firstname}`}</span>
                    </div>
                {InformationUser && (<div className='bg-white absolute bottom-[-50px] right-[-50px] shadow-xl border'>
                    <ul className=''>
                      <Link to={+current?.role === 1945 ? `/${path.ADMIN}/${path.DASHBOARD}` : `/${path.MEMBER}/${path.PERSONAL}`}  >
                      <li className='pt-2 pb-1 px-2 hover:text-white hover:bg-slate-500'>{+current?.role === 1945 ? 'Admin' : 'User'}</li>
                      </Link>                     
                    <li className='px-2 pt-1 cursor-pointer pb-2 text-red-500 hover:text-white hover:bg-slate-500' onClick={() => { dispatch(logout()); clearLocalStorage(); }}>Logout</li>
                    </ul>
                    
                  </div>) }
                </Fragment>}

              </div> ):
              <Link to={`${path.LOGIN}`}>
                <div className=' flex items-center rounded-lg justify-center flex-col'>
                  <BsPersonCircle size={25} />
                  <span>Đăng nhập</span>
                </div>
              </Link>}
            
          </div>

        </div>

      </div>
    </div>
  )
}

export default WithRase(memo(TopHearder))