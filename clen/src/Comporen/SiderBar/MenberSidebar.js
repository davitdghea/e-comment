import React, { memo, Fragment, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { memberSidebar } from 'Ultils/Contants'
import { IoHome } from "react-icons/io5";
import clsx from 'clsx'
import { AiOutlineCaretDown, AiOutlineCaretRight } from 'react-icons/ai'
import { useSelector } from 'react-redux'
const activedStyle = 'px-4 py-2 flex items-center gap-2 text-white  bg-gray-500'
const notActivedStyle = 'px-4 py-2 flex items-center gap-2  hover:text-white hover:bg-gray-400'
const MenberSidebar = () => {
  const { current } = useSelector(state => state.user)
  const [actived, setActived] = useState([])
  const handleShowTabs = (tabID) => {
    if (actived.some(el => el === tabID)) setActived(prev => prev.filter(el => el !== tabID))
    else setActived(prev => [...prev, tabID])
  }
  return (
    <div onClick={(e) => e.stopPropagation()} className='fixed sm:relative z-50 flex-col  h-full min-h-screen w-full sm:max-w-[300px]  max-w-[200px] bg-gray-200 items-center py-4 text-black'>
     
        <div className='w-full flex flex-col justify-center items-center'>
          <img src={current?.avatar || "https://static.vecteezy.com/system/resources/previews/005/005/788/original/user-icon-in-trendy-flat-style-isolated-on-grey-background-user-symbol-for-your-web-site-design-logo-app-ui-illustration-eps10-free-vector.jpg"} alt='logo' className='w-[36px] object-contain' />
          <span>{`${current?.lastname} ${current?.firstname}`}</span>
        </div>
        <div>
          {memberSidebar.map(el => (
            <Fragment key={el.id}>
              {el.type === 'Single' && <NavLink to={el.path} className={({ isActive }) => clsx(isActive && activedStyle, !isActive && notActivedStyle)}>
                <span className=''>{el.icon}</span>
                <span className='text-md'>{el.text}</span>
              </NavLink>}
              {el.type === 'Parent' && <div onClick={() => handleShowTabs(el.id)} className={({ isActive }) => clsx(isActive && activedStyle, !isActive && notActivedStyle)}>
                <div className='flex items-center gap-2 px-4 py-2 hover:bg-gray-500 cursor-pointer'>
                  <div className=' flex items-center gap-2'>
                    <span>{el.icon}</span>
                    <span>{el.text}</span>
                  </div>
                  {!actived.some(id => id === el.id) ? <AiOutlineCaretDown /> : <AiOutlineCaretRight />}
                </div>
                {actived.some(id => +id === +el.id) && <div className='flex flex-col pl-6'>
                  {el.subMenu.map(item => (
                    <NavLink onClick={e => e.stopPropagation()}
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
          <NavLink
            to={'/'}
            className={clsx(notActivedStyle)}
          >
            <span><IoHome /></span>
            <span>Go home</span>
          </NavLink>
        </div>
      
    </div>
  )
}

export default memo(MenberSidebar)