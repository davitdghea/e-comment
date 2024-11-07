import React from 'react'
import { IoIosMenu } from "react-icons/io";
import {NavLink} from "react-router-dom"
import {useSelector} from 'react-redux'
import {creactSlug} from '../../Ultils/Hellpers'
import icons from '../../Ultils/Icons'
import path from 'Ultils/Path'
import { useLocation } from 'react-router-dom';

const { CiCamera, TfiPrinter, IoIosPhonePortrait, IoIosTabletPortrait, AiOutlineLaptop, BsFillSpeakerFill, FaHeadphones, PiTelevisionSimpleBold } = icons
const array = {
  IoIosTabletPortrait, IoIosPhonePortrait, AiOutlineLaptop, BsFillSpeakerFill, CiCamera, FaHeadphones, PiTelevisionSimpleBold, TfiPrinter
}

const Sideba = ({ Style = 'sm:flex flex-col rounded-lg mt-6 hidden border shadow-xl' }) => {
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
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  }
  const query = useQuery();
  const category = query.get('category');

return (   
    <div className={Style} onClick={e => {e.stopPropagation()}}>
    <p className='pl-4 bg-blue-500 text-white sm:rounded-t-lg rounded-t-none items-center font-black text-[20px] flex py-4 '><span className='mr-2'><IoIosMenu size={35}/></span> Shop Categories</p>
    {result?.map(el => {
      const IconComponent = el.icon;
      return (
        <NavLink
          key={creactSlug(el.product.title)}
          to={`${path.PRODUCTS}?category=${el.product.title}`}
          className={`${category === el.product.title ? 'bg-green-400 text-white' : ""}  flex items-center border pl-4 py-[11px]  text-sm hover:bg-slate-200 hover:text-blue-500`}
        >
          <span className='pr-4'> 
            {IconComponent && <IconComponent size={24}/>}
          </span>
          <span className='text-[15px] font-medium '>
            {el.product.title}
          </span>
        </NavLink>
      );
    })}</div>
  )
}

export default Sideba