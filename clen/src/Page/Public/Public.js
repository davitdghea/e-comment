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
  }, [dispatch])
const[styleMenu,setStyleMenu] = useState(false)
const handleClickMenu = useCallback((e) =>{
  setStyleMenu(e)
}, [setStyleMenu]) 
  const { isShowCart } = useSelector(state => state.app)
  return (
    <div className='w-full flex flex-col items-center relative'>
      {isShowCart && <div onClick={() => dispatch(ShowCart())} className='fixed top-0 bottom-0 right-0 left-0 insert-0 bg-overlay z-50 flex justify-end'>
        <Cart />
      </div>}
      <TopHearder handleClickMenu={handleClickMenu} />
      {styleMenu && <div onClick={() => setStyleMenu(false)} className='absolute top-0 bottom-0 left-0 right-0 bg-gray-400/50 z-50'>
        <Sideba  Style={'flex flex-col shadow-xl sm:rounded-lg sm:top-[150px] fixed z-100 bg-gray-50 sm:left-[130px] left-0 top-0 sm:bottom-[150px] w-[190px] sm:w-[250px] h-full  sm:max-h-[370px] sm:h-[370px] '} />

      </div>
      }
        <div className='w-full  flex item-center flex-col mt-[100px]'>
          <Outlet/>
        </div>

      <Footer handleClickMenu={handleClickMenu} />
    </div>
  )
}

export default Public