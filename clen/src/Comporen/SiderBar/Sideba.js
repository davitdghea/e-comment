import React from 'react'
import {NavLink} from "react-router-dom"
import {useSelector} from 'react-redux'
import {creactSlug} from '../../Ultils/Hellpers'
import icons from '../../Ultils/Icons'
import path from 'Ultils/Path'

const {   CiCamera, TfiPrinter, IoIosPhonePortrait, IoIosTabletPortrait, AiOutlineLaptop, BsFillSpeakerFill, FaHeadphones, PiTelevisionSimpleBold } = icons
const array = {
  IoIosTabletPortrait, IoIosPhonePortrait, AiOutlineLaptop, BsFillSpeakerFill, CiCamera, FaHeadphones, PiTelevisionSimpleBold, TfiPrinter
}

const Sideba = ({ Style = 'sm:flex flex-col shadow-xl rounded-lg mt-6 hidden ' }) => {
const {categories} = useSelector(state => state.app)  
  const iconKeys = Object.keys(array);
  const result = categories?.map((item, index) => {
    
    const iconKey = iconKeys[index] || 'No icon available';
    const icon = icons[iconKey] || 'No icon';

    return {
      product: item,
      icon: icon
    };
  });

return (   
    <div className={Style} onClick={e => {e.stopPropagation()}}>
      <p className='bg-slate-400 font-black text-[20px] flex justify-center py-4 sm:hidden'>MENU</p>
    {result?.map(el => {
      const IconComponent = el.icon;
      return (
        <NavLink
          key={creactSlug(el.product.title)}
          to={`${path.PRODUCTS}?category=${el.product.title}`}

          className={"flex items-center pl-4 py-[11px] text-sm hover:bg-slate-200 hover:text-red-500"}
        >
          <span className='pr-4'> {IconComponent && <IconComponent size={24}/>}</span> <span className='text-[15px]  '>{el.product.title}</span>
        </NavLink>
      );
    })}</div>
  )
}

export default Sideba