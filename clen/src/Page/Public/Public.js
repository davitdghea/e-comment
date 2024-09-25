import React, { useEffect, useState } from 'react'
import {Outlet} from 'react-router-dom'
import {TopHearder,Footer,Sideba, Cart} from "../../Comporen/Index"
import { useCallback } from 'react'
import { ShowCart } from 'St/App/Appslice';
import { useDispatch, useSelector } from 'react-redux';
import { GetCategory } from 'St/App/AsyncAction';
const Public = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(GetCategory())
  }, [])
const[styleMenu,setStyleMenu] = useState(false)
const handleClickMenu = useCallback((e) =>{
  setStyleMenu(e)
}) 
  const { isShowCart } = useSelector(state => state.app)
  return (
    <div className='w-full flex flex-col items-center relative'>
      {isShowCart && <div onClick={() => dispatch(ShowCart())} className='fixed top-0 bottom-0 right-0 left-0 insert-0 bg-overlay z-50 flex justify-end'>
        <Cart />
      </div>}
      <TopHearder handleClickMenu={handleClickMenu} />
      {styleMenu && <div onClick={() => setStyleMenu(false)} className='absolute top-0 bottom-0 left-0 right-0 bg-gray-400/50 z-50'>
        <Sideba  style={'flex flex-col shadow-xl rounded-lg top-[124px] fixed z-100 bg-gray-50 left-[87px] w-[260px]'} />

      </div>
      }
        <div className='w-full flex item-center flex-col mt-[100px]'>
          <Outlet/>
        </div>

      <Footer handleClickMenu={handleClickMenu} />
    </div>
  )
}

export default Public