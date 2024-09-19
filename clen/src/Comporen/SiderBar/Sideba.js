import React from 'react'
import {NavLink} from "react-router-dom"
import {useSelector} from 'react-redux'
import {creactSlug} from '../../Ultils/Hellpers'
import icons from '../../Ultils/Icons'

const {   CiCamera, TfiPrinter, IoIosPhonePortrait, IoIosTabletPortrait, AiOutlineLaptop, BsFillSpeakerFill, FaHeadphones, PiTelevisionSimpleBold } = icons
const array = {
  IoIosTabletPortrait, IoIosPhonePortrait, AiOutlineLaptop, BsFillSpeakerFill, CiCamera, FaHeadphones, PiTelevisionSimpleBold, TfiPrinter
}

const Sideba = ({ style = 'flex flex-col shadow-xl rounded-lg mt-6' }) => {
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
    
    <div className={style} onClick={e => {e.stopPropagation()}}>
    {result?.map(el => {
      const IconComponent = el.icon;
      return (
        <NavLink

          key={creactSlug(el.product.title)}
          to={el.product.title}
          className={"flex items-center pl-4 py-[10px] text-sm hover:bg-slate-200"}
        >
          <span className='pr-4'> {IconComponent && <IconComponent size={24}/>}</span> <span className='text-[15px] hover:text-red-500 '>{el.product.title}</span>
        </NavLink>
      );
    })}</div>
  )
}

export default Sideba