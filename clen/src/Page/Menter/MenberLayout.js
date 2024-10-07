import React, { useCallback, useState } from 'react'
import { Outlet,Navigate } from 'react-router-dom' 
import path from 'Ultils/Path'
import { useSelector } from 'react-redux'
import { MenberSidebar } from 'Comporen/Index'
import { IoIosMenu } from "react-icons/io";
const MenberLayout = () => {
  const { isLoggedIn, current }=useSelector(state=>state.user)
  const [menu, setMenu] = useState(false)
  const hienMenu = useCallback(() =>{
    setMenu(menu)
  })
  if (!isLoggedIn || !current) return <Navigate to={`/${path.LOGIN}`} replace={true}/>
  
  return (
    <div className='flex'>
      <div className={`${menu ? 'block' : 'hidden'} sm:block w-full sm:max-w-[300px] max-w-[full] bg-slate-200/10 sm:bg-none z-50 fixed sm:relative`} onClick={() =>  setMenu(false)}> 
        <div className='sm:block fixed top-0 bottom-0 right-0 left-0 w-full sm:max-w-[300px] insert-0 bg-overlay sm:bg-none z-40 flex justify-start'>
          <MenberSidebar />
        </div>      
     </div>
     <div className='w-full relative'>
        <div className='block sm:hidden p-3 bg-slate-300 fixed  z-40 ml-3 mt-3 rounded-sm' onClick={() => { setMenu(!menu)}}><IoIosMenu /></div> 
        <Outlet />
     </div>    
    </div>
  )
}

export default MenberLayout