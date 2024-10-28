import React, { useState } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import path from 'Ultils/Path'
import { useSelector } from 'react-redux'
import { AdminSidebar } from 'Comporen/Index'
import { IoIosMenu } from 'react-icons/io'
const AdminLayout = () => {
  const { isLoggedIn, current } = useSelector(state => state.user)
  const [hienMenu,setHienMenu] = useState(false)
  if (!isLoggedIn || !current || +current.role !== 1945) return <Navigate to={`/${path.LOGIN}`} replace={true} />
  return (
    <div className='flex w-full bg-slate-300 min-h-screen '>
      <div className={`${hienMenu ? 'block' :"hidden"} sm:block sm:w-[300px] top-0 bottom-0 flex-none  relative`}>
        <div onClick={() => { setHienMenu(!hienMenu) }} className='sm:block fixed top-0 bottom-0 right-0 left-0 w-full sm:max-w-[300px] insert-0 bg-overlay sm:bg-none z-50 flex justify-start'>
          <AdminSidebar />
        </div>       
      </div >
      <div className='flex-auto'>
        <div className='block sm:hidden p-3 bg-slate-300 fixed  z-40 ml-3 mt-3 rounded-sm' onClick={() => { setHienMenu(!hienMenu) }}><IoIosMenu /></div> 
        <Outlet />
      </div>
      
    </div>
  )
}

export default AdminLayout