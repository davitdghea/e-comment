import React, { memo, Fragment, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { adminSidebar } from 'Ultils/Contants'
import clsx from 'clsx'
import { AiOutlineCaretDown,AiOutlineCaretRight } from 'react-icons/ai'
const activedStyle = 'px-4 py-2 flex items-center gap-2 text-white  bg-gray-500'
const notActivedStyle = 'px-4 py-2 flex items-center gap-2  hover:text-white hover:bg-gray-400'
const AdminSidebar = () => {
  
    const [actived,setActived] = useState([])
    const handleShowTabs = (tabID) =>{
        if(actived.some(el => el === tabID)) setActived(prev => prev.filter(el => el!==tabID))
            else setActived(prev => [...prev,tabID])
    }
    return (
        <div onClick={(e) => e.stopPropagation()} className=' flex-col  min-h-screen bg-gray-200 items-center py-4 text-black'>
            <Link to={'/'} className='flex flex-col justify-center py-4 items-center gap-2'>
                <img src="https://digital-world-2.myshopify.com/cdn/shop/files/logo_digital_new_250x.png?v=1613166683" alt='logo' className='w-[200px] object-contain' />
                <smail>Admin Wordspance</smail>
            </Link>
            <div>
                {adminSidebar.map(el => (
                    <Fragment key={el.id}>
                        {el.type === 'Single' && <NavLink to={el.path} className={({isActive}) => clsx(isActive && activedStyle,!isActive && notActivedStyle)}>
                            <span>{el.icon}</span>
                            <span>{el.text}</span>
                        </NavLink>}
                        {el.type === 'Parent' && <div onClick={() => handleShowTabs(el.id)} className={({ isActive }) => clsx(isActive && activedStyle, !isActive && notActivedStyle)}>
                            <div className='flex items-center gap-2 px-4 py-2 hover:bg-gray-500 cursor-pointer'>
                                <div className=' flex items-center gap-2'>
                                    <span>{el.icon}</span>
                                    <span>{el.text}</span>
                                </div>
                                {!actived.some(id => id === el.id)?<AiOutlineCaretDown />:<AiOutlineCaretRight />}
                            </div>
                            {actived.some(id => +id === +el.id) && <div className='flex flex-col pl-6'>
                            {el.subMenu.map(item => (
                                <NavLink onClick={e=> e.stopPropagation()}
                                 key={el.text}
                                    className={({ isActive }) => clsx(isActive && activedStyle, !isActive && notActivedStyle)}
                                  to={item.path}>
                                    {item.text}
                                </NavLink>
                            ))}
                            </div>

                            }
                        </div>}
                    </Fragment>
                ))}
            </div>
        </div>
    )
}

export default memo(AdminSidebar)