import React from 'react'
import {navigation} from 'Ultils/Contants'
import {NavLink} from 'react-router-dom'

const Navbar = () => {
 
  return (
    <div className='w-main m-auto h-[full] py-2 border text-sm flex items-center'>
      {navigation.map(el =>{
      
        return(
          <NavLink
            to={el.path}
            key={el.id}
            className={({isActive}) => isActive ? 'pr-12 hover:text-red-500 text-red-500' : "pr-12 hover:text-red-500"}
          >
            {el.value}
          </NavLink>
        )
        
})}
    </div>
  )
}

export default Navbar