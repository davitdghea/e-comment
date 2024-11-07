import React, { memo, Fragment } from 'react'
import {  NavLink } from 'react-router-dom'
import { memberSidebar } from 'Ultils/Contants'
import { IoHome } from "react-icons/io5";
import clsx from 'clsx'
import { useSelector } from 'react-redux'
import { IoIosLogOut } from "react-icons/io";
import { useDispatch } from 'react-redux';

import { logout } from 'St/User/Userslice';
const activedStyle = ' py-2 px-4 bg-blue-200 text-blue-800 font-semibold flex items-center space-x-2'
const notActivedStyle = 'py-2 px-4 hover:bg-gray-400 hover:text-white flex items-center space-x-2'
const MenberSidebar = () => {
  const { current } = useSelector(state => state.user)
  const clearLocalStorage = () => {
    localStorage.clear()
  }

  const dispatch = useDispatch();
  return (
    <div onClick={(e) => e.stopPropagation()} className='fixed sm:relative z-50 flex-col  h-full min-h-screen w-full sm:max-w-[300px]  max-w-[200px] bg-gray-200 items-center py-4 text-black'>
        <div className='w-full flex flex-col justify-center items-center'>
        <img className='w-full max-w-[100px] h-full max-h-[100px] rounded-full mx-auto' src={current?.avatar || "https://static.vecteezy.com/system/resources/previews/005/005/788/original/user-icon-in-trendy-flat-style-isolated-on-grey-background-user-symbol-for-your-web-site-design-logo-app-ui-illustration-eps10-free-vector.jpg"} alt='logo'  />
          <span className='text-gray-700 font-semibold mt-2'>{`${current?.lastname} ${current?.firstname}`}</span>
        </div>
        <div>
        
          {memberSidebar.map(el => (
            <Fragment key={el.id}>
              {el.type === 'Single' && <NavLink to={el.path} className={({ isActive }) => clsx(isActive && activedStyle, !isActive && notActivedStyle)}>
                <span className=''>{el.icon}</span>
                <span className='text-md'>{el.text}</span>
              </NavLink>}
            </Fragment>
          ))}
        <NavLink
          to={'/'}
          className={clsx(notActivedStyle)}
        >
          <span><IoHome size={25} /></span>
          <span>Go home</span>
        </NavLink>
        <div className={clsx(notActivedStyle)} onClick={() => { dispatch(logout()); clearLocalStorage(); }}>
          <span><IoIosLogOut size={25} /></span>
          <span className='text-red-500'>Logout</span>
        </div>
        </div>
      
    </div>
  )
}

export default memo(MenberSidebar)