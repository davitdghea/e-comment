import React from 'react'
import { Outlet,Navigate } from 'react-router-dom' 
import path from 'Ultils/Path'
import { useSelector } from 'react-redux'
import { MenberSidebar } from 'Comporen/Index'
const MenberLayout = () => {
  const { isLoggedIn, current }=useSelector(state=>state.user)
  if (!isLoggedIn || !current) return <Navigate to={`/${path.LOGIN}`} replace={true}/>
  return (
    <div className='flex'>
     <div className='w-full max-w-[300px]'>
        <MenberSidebar />
     </div>
     <div className='w-full'>
        <Outlet />
     </div>    
    </div>
  )
}

export default MenberLayout